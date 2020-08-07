// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TexasGamer from "../Bean/TexasGamer";

export enum GamerState {
    betting = 10,//下注中
    bet = 1,//已下注
    smallBlind = 2,//小盲注
    bigBlind = 3,//大盲注
    button = 4,//庄家
    waiting = 5,//等待下注
    raise = 6,//已加注
    call = 7,//已跟注
    fold = 8,//已弃牌
    check = 9,//已过牌
    allIn = 11,//已全下注
}

const StateMap: Map<GamerState, string> = new Map<GamerState, string>();
StateMap.set(GamerState.betting, "下注中");
StateMap.set(GamerState.bet, "下注");
StateMap.set(GamerState.smallBlind, "小盲注");
StateMap.set(GamerState.bigBlind, "大盲注");
StateMap.set(GamerState.button, "庄家");
StateMap.set(GamerState.waiting, "等待");
StateMap.set(GamerState.raise, "加注");
StateMap.set(GamerState.call, "跟注");
StateMap.set(GamerState.fold, "弃牌");
StateMap.set(GamerState.check, "过牌");
StateMap.set(GamerState.allIn, "全下注");

const {ccclass, property} = cc._decorator;
const GamerEventKey = "gamer.update.";

@ccclass
export default class TexasGamerLogic extends cc.Component {

    @property({type: cc.Label, tooltip: "状态节点"})
    statusNode: cc.Label = null;

    @property({type: cc.Label, tooltip: "用户名昵称节点"})
    nameNode: cc.Label = null;

    @property({type: cc.Label, tooltip: "用户积分节点"})
    pointNode: cc.Label = null;

    @property({type: cc.Label, tooltip: "用户投注节点"})
    betNode: cc.Label = null;

    @property({type: cc.Sprite, tooltip: "用户头像节点"})
    avatarNode: cc.Sprite = null;

    _gamer: TexasGamer = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    gamerInit(gamer: TexasGamer) {
        if (!this._gamer) {
            this._gamer = gamer;
            cc.director.on(GamerEventKey + this._gamer.gamerId, this._updateUI, this);
        }
        this._updateUI();
    }

    _updateUI() {
        this.nameNode.string = this._gamer.gamerId;
        this.pointNode.string = this._gamer.point.toString();
        this.statusNode.string = StateMap.get(this._gamer.state);
    }

    onDestroy() {
        if (this._gamer) {
            cc.director.off(GamerEventKey + this._gamer.gamerId);
        }
    }

    // update (dt) {}
}