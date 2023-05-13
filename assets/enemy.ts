import { _decorator, Component, BoxCollider2D,Contact2DType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('enemy')
export class enemy extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }
    onLoad() {
        let collider = this.getComponent(BoxCollider2D)
         collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
         collider.on(Contact2DType.STAY_CONTACT, this.onStayContact, this);
         collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }
   
    onBeginContact(){
        console.log('onBeginContact')
    }
    onStayContact(){
        console.log('onStayContact')
    }
    onEndContact(){
        console.log('onEndContact')
    }
}

