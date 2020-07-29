// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import VMUtil from "../Util/VMUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Result extends cc.Component {

    @property(cc.Label)
    myselfLabel: cc.Label = null;
    @property(cc.Label)
    leftLabel: cc.Label = null;
    @property(cc.Label)
    rightLabel: cc.Label = null;

    @property(cc.Label)
    myselfPoint: cc.Label = null;
    @property(cc.Label)
    leftPoint: cc.Label = null;
    @property(cc.Label)
    rightPoint: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:

    //onLoad () {}

    start () {

    }

    setData() {
        this.myselfLabel.string = VMUtil.getMyself().gamerId;
        this.myselfPoint.string = VMUtil.getMyself().pointDelta + "";
        this.leftLabel.string = VMUtil.getLeft().gamerId;
        this.leftPoint.string = VMUtil.getLeft().pointDelta + "";
        this.rightLabel.string = VMUtil.getRight().gamerId;
        this.rightPoint.string = VMUtil.getRight().pointDelta + "";
    }

    // update (dt) {}
}
