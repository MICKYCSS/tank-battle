import { _decorator, Component, BoxCollider2D,Contact2DType,RigidBody } from 'cc';
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
   
    onBeginContact(ev,self,otherCollider){
        if(self.node._name === 'bullet'){
            this.node.destroy()
        }
    }
    onStayContact(){
        console.log('enemy onStayContact')
    }
    onEndContact(){
        console.log('enemy onEndContact')
    }
}

