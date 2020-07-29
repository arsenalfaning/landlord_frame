// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import VMUtil from "../Util/VMUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        VMUtil.init();
    }

    start () {

    }

    onSubmit() {
        if (VMUtil.getMyself().gamerId) {
            cc.director.loadScene("Table");
        }
    }

    setGamerId(value:cc.EditBox) {
        VMUtil.getMyself().gamerId = value.string;
    }

    // update (dt) {}
}
