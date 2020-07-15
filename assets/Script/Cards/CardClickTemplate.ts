// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CardTemplate from "./CardTemplate";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CardClickTemplate extends CardTemplate {

    
    selected: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouch, this);
    }

    onTouch () {
        this.selected = !this.selected;
        var vec2 = this.node.getPosition();
        if (this.selected) {
            vec2.y += 20;
        } else {
            vec2.y -= 20;
        }
        this.node.setPosition(vec2);
    }

    // update (dt) {}
}
