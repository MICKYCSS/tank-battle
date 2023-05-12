import { _decorator, Component, systemEvent, SystemEvent, EventKeyboard, Prefab,quat,KeyCode,
    instantiate,RigidBody2D,Vec2
 } from 'cc';
const { ccclass, property } = _decorator;

const DIRECTION_UP = quat(0,0,0,1)
const DIRECTION_LEFT = quat(0,0,0.7,0.7)
const DIRECTION_RIGHT = quat(0,0,-0.7,0.7)
const DIRECTION_DOWN = quat(0,0,1,6.12*Math.E ** (-17))

@ccclass('player')
export class player extends Component {
    @property(Prefab)
    bulletPrefab: Prefab = null;

    private _moveOffset: number = 10.0;
    private _bulletSpeed: number = 500;
    private _bulletInterval: number = 0.08;// 子弹间隔时间
    private _bulletVelocity:Vec2 = new Vec2(0, 1); // 子弹方向
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
        // 缩放向量大小
        this._bulletVelocity.multiplyScalar(this._bulletSpeed);
        // console.log(bullet.getComponent(RigidBody2D))
        // linearVelocity用来改变子弹线速度
        bullet.getComponent(RigidBody2D).linearVelocity = this._bulletVelocity
    }
    onLoad () {
        // 注册键盘事件
        // console.log(this.node,this.node.getPosition(),this.node.getRotation(),this.node.anchorX,this.node.anchorY)
        // console.log(this.node,this.node.getPosition(),this.node.getRotation(),this.node.anchorX,this.node.anchorY)
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    onDestroy () {
        // 注销键盘按下和抬起事件的监听器
        systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onCollisionEnter(){
        console.log('123')
    }

    private onBulletDirection(direction){
        switch (direction) {
            case DIRECTION_UP:
                this._bulletVelocity = new Vec2(0, 1)
                break;
            case DIRECTION_DOWN:
                this._bulletVelocity = new Vec2(0, -1)
                break;
            case DIRECTION_LEFT:
                this._bulletVelocity = new Vec2(-1, 0)
                break;
            case DIRECTION_RIGHT:
                this._bulletVelocity = new Vec2(1, 0)
                break
            default:
                break;
        }
    }

    private onMove(direction,offset){
        this.onBulletDirection(direction)
        const { x,y } = this.node.getPosition();
        this.node.setRotation(direction);
        if(direction === DIRECTION_UP || direction === DIRECTION_DOWN){
            this.node.setPosition(x, y + offset);
        }else{
            this.node.setPosition(x + offset,y);
        }
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
                this.onMove(DIRECTION_UP,this._moveOffset)
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                // 下移
                 this.onMove(DIRECTION_DOWN,-this._moveOffset)
                break;
            case  KeyCode.KEY_A:
            case  KeyCode.ARROW_LEFT:
                // 左移
                this.onMove(DIRECTION_LEFT,-this._moveOffset)
                break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                // 右移
                   this.onMove(DIRECTION_RIGHT,this._moveOffset)
                break;
            case KeyCode.SPACE:
                this._isFiring = true
                break
            default:
                break;
        }
    }
  
}
