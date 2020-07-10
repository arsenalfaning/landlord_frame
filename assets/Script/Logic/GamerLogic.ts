// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameAction } from "./GameLogic";

export enum GamerState {
    WaitingForMatch,//等待匹配
    WaitingForDeal,//等待发牌
    Approving,//正在抢地主
    WaitingForApprove,//等待别人抢地主
    Playing,//正在出牌
    WaitingForPlay,//等待别人出牌
    ViewingResult,//查看游戏结果
}


/**
 * 玩家操作变化类
 */
class GamerTransition {
    /**
     * 当前状态
     */
    currentState: GamerState;
    /**
     * 操作
     */
    action: GameAction;
    /**
     * 下一个状态
     */
    nextState: GamerState;

    constructor(currentState: GamerState, action: GameAction, nextState: GamerState) {
        this.currentState = currentState;
        this.action = action;
        this.nextState = nextState;
    }
}

const GamerTransitions: GamerTransition[] = [
    new GamerTransition(GamerState.WaitingForMatch, GameAction.Room, GamerState.WaitingForDeal),
    new GamerTransition(GamerState.WaitingForDeal, GameAction.Deal, GamerState.WaitingForApprove),
    new GamerTransition(GamerState.Approving, GameAction.Approve, GamerState.WaitingForApprove),
    new GamerTransition(GamerState.WaitingForApprove, GameAction.DealAdditional, GamerState.WaitingForPlay),
    new GamerTransition(GamerState.Playing, GameAction.Play, GamerState.WaitingForPlay),
    new GamerTransition(GamerState.WaitingForPlay, GameAction.Over, GamerState.ViewingResult),
];

const {ccclass, property} = cc._decorator;
@ccclass
export default class GamerLogic extends cc.Component {

    @property(cc.Node)
    gamerNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
