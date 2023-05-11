import { _decorator, Component, systemEvent, SystemEvent, EventKeyboard, Prefab,quat,KeyCode,
    instantiate,RigidBody2D,Vec2
 } from 'cc';
const { ccclass, property } = _decorator;

const FROM_DIRECTION = quat(0,0,0,1)
const LEFT_DIRECTION = quat(0,0,0.7,0.7)
const RIGHT_DIRECTION = quat(0,0,-0.7,0.7)
const BACK_DIRECTION = quat(0,0,1,6.12*Math.E ** (-17))

@ccclass('player')
export class player extends Component {
    @property(Prefab)
    bulletPrefab: Prefab = null;

    private _moveOffset: number = 10.0;
    private _bulletSpeed: number = 500;
    private _bulletInterval: number = 0.2;
    private _timeElapse: number = 0;
    private _isFiring: boolean = false;

    update (deltaTime: number) {
        if (this._isFiring) {
            this._timeElapse += deltaTime;
            if (this._timeElapse >= this._bulletInterval) {
                this._timeElapse = 0;
                this.fire();
            }
        }
    }
    private fire () {
        const bullet = instantiate(this.bulletPrefab);
        bullet.setPosition(this.node.position);
        this.node.parent.addChild(bullet);
        // const worldMatrix = this.node.getWorldMatrix(); // 获取节点的世界矩阵
        const velocity = new Vec2(0, 1); // 使用矩阵的第一列作为向量的坐标
        velocity.multiplyScalar(this._bulletSpeed);
        console.log(bullet.getComponent(RigidBody2D))
        bullet.getComponent(RigidBody2D).linearVelocity = velocity
    }
    onLoad () {
        // 注册键盘事件
        console.log(this.node,this.node.getPosition(),this.node.getRotation(),this.node.anchorX,this.node.anchorY)
        console.log(this.node,this.node.getPosition(),this.node.getRotation(),this.node.anchorX,this.node.anchorY)
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    onDestroy () {
        // 注销键盘按下和抬起事件的监听器
        systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    private onMoveX(offsetX){
        const { x,y } = this.node.getPosition();
        this.node.setPosition(x + offsetX,y);
    }

    private onMoveY(offsetY){
        const { x,y } = this.node.getPosition();
        this.node.setPosition(x,y + offsetY);
    }
    private stopMove () {
        // 停止移动时，将坦克速度设置为 0
        const rigidbody = this.node.getComponent(RigidBody2D);
        const velocity = rigidbody.linearVelocity;
        velocity.x = 0;
        velocity.y = 0;
        rigidbody.linearVelocity = velocity;
    }
    private onKeyUp(event: EventKeyboard){
        switch (event.keyCode) {
            case KeyCode.ARROW_UP:
            case KeyCode.ARROW_DOWN:
            case KeyCode.ARROW_LEFT:
            case KeyCode.ARROW_RIGHT:
                this.stopMove();
                break;
            case KeyCode.SPACE:
                this._isFiring = false;  // 松开空格键后停止发射子弹
                break;
        }
    }


    private onKeyDown (event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                // 上移
                this.node.setRotation(FROM_DIRECTION);
                this.onMoveY(this._moveOffset)
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                // 下移
                this.node.setRotation(BACK_DIRECTION);
                this.onMoveY(-this._moveOffset)
                break;
            case  KeyCode.KEY_A:
            case  KeyCode.ARROW_LEFT:
                // 左移
                this.node.setRotation(LEFT_DIRECTION);
                this.onMoveX(-this._moveOffset)
                break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                // 右移
                this.node.setRotation(RIGHT_DIRECTION);
                this.onMoveX(this._moveOffset)
                break;
            case KeyCode.SPACE:
                this._isFiring = true
                break
            default:
                break;
        }
    }
  
}
