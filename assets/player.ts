import { _decorator, Component, systemEvent, SystemEvent, EventKeyboard, macro,quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('player')
export class HelloWorld extends Component {
    private moveOffset: number = 10.0;

    onLoad () {
        // 注册键盘事件
        console.log(this.node,this.node.getPosition(),this.node.getRotation(),this.node.anchorX,this.node.anchorY)
        console.log(this.node,this.node.getPosition(),this.node.getRotation(),this.node.anchorX,this.node.anchorY)
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onMoveX(offsetX){
        const { x,y } = this.node.getPosition();
        this.node.setPosition(x + offsetX,y);
    }

    onMoveY(offsetY){
        const { x,y } = this.node.getPosition();
        this.node.setPosition(x,y + offsetY);
    }

    onKeyDown (event: EventKeyboard) {
        switch (event.keyCode) {
            case macro.KEY.w:
            case macro.KEY.up:
                // 上移
                this.onMoveY(this.moveOffset)
                break;
            case macro.KEY.s:
            case macro.KEY.down:
                // 下移
                this.onMoveY(-this.moveOffset)
                break;
            case macro.KEY.a:
            case macro.KEY.left:
                // 左移
                this.node.setRotation(quat(0,0,0.7,0.7));
                this.onMoveX(-this.moveOffset)
                break;
            case macro.KEY.d:
            case macro.KEY.right:
                // 右移
                this.onMoveX(this.moveOffset)
                break;
            default:
                break;
        }
    }
}