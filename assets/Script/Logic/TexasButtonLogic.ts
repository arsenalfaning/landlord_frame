// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GamerState } from "./TexasGamerLogic";
import TexasGameBean from "../Bean/TexasGameBean";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TexasButtonLogic extends cc.Component {

    @property(cc.Button)
    bet10Button: cc.Button = null;

    @property(cc.Button)
    bet20Button: cc.Button = null;

    @property(cc.Button)
    bet50Button: cc.Button = null;

    @property(cc.Button)
    bet100Button: cc.Button = null;

    @property(cc.Button)
    callButton: cc.Button = null;

    @property(cc.Button)
    foldButton: cc.Button = null;

    @property(cc.Button)
    checkButton: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._hideAll();
    }

    _hideAll() {
        this.bet10Button.node.active = false;
        this.bet20Button.node.active = false;
        this.bet50Button.node.active = false;
        this.bet100Button.node.active = false;
        this.callButton.node.active = false;
        this.foldButton.node.active = false;
        this.checkButton.node.active = false;
    }

    start () {

    }

    // update (dt) {}

    updateUI(game: TexasGameBean) {
        this._hideAll();
        const myself = game.gamers[game.myselfIndex];
        if (myself.state == GamerState.betting) {
            let callValue = 0;
            if (game.maxBetted > 0) {
                this.callButton.node.active = true;
                callValue = game.maxBetted - (myself.betPoint ? myself.betPoint : 0);
                console.log(callValue);
                let string = this.callButton.getComponentInChildren(cc.Label).string;
                this.callButton.getComponentInChildren(cc.Label).string = string.split("$")[0] + "$" + callValue;
                console.log(this.callButton.getComponentInChildren(cc.Label).string);
            } else {
                this.checkButton.node.active = true;
            }
            this.bet10Button.node.active = callValue < 10 && myself.point >= 10;
            this.bet20Button.node.active = callValue < 20 && myself.point >= 20;
            this.bet50Button.node.active = callValue < 50 && myself.point >= 50;
            this.bet100Button.node.active = callValue < 100 && myself.point >= 100;
            this.foldButton.node.active = true;
        }
    }
}
