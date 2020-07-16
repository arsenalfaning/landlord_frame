// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameAction, GameState } from "./GameLogic";
import GameFramePlayer from "../Component/GameFramePlayer";
import ActionFactory from "../Action/ActionFactory";
import VMUtil from "../Util/VMUtil";
import CardSuggestUtil from "../Util/CardSuggestUtil";
import CardHand from "../Util/CardHand";
import CardBundleClick from "../Cards/CardBundleClick";
import CardRuleUtil from "../Util/CardRuleUtil";
import CardUtil from "../Util/CardUtil";
import ResultBean from "../Bean/ResultBean";

export enum GamerState {
    WaitingForMatch = 0,//等待匹配
    WaitingForDeal = 1,//等待发牌
    Approving = 8,//正在抢地主
    WaitingForApprove = 3,//等待别人抢地主
    Playing  = 9,//正在出牌
    WaitingForPlay  = 5,//等待别人出牌
    ViewingResult = 6,//查看游戏结果
}


// /**
//  * 玩家操作变化类
//  */
// class GamerTransition {
//     /**
//      * 当前状态
//      */
//     currentState: GamerState;
//     /**
//      * 操作
//      */
//     action: GameAction;
//     /**
//      * 下一个状态
//      */
//     nextState: GamerState;

//     constructor(currentState: GamerState, action: GameAction, nextState: GamerState) {
//         this.currentState = currentState;
//         this.action = action;
//         this.nextState = nextState;
//     }
// }

// const GamerTransitions: GamerTransition[] = [
//     new GamerTransition(GamerState.WaitingForMatch, GameAction.Room, GamerState.WaitingForDeal),
//     new GamerTransition(GamerState.WaitingForDeal, GameAction.Deal, GamerState.WaitingForApprove),
//     new GamerTransition(GamerState.Approving, GameAction.Approve, GamerState.WaitingForApprove),
//     new GamerTransition(GamerState.WaitingForApprove, GameAction.DealAdditional, GamerState.WaitingForPlay),
//     new GamerTransition(GamerState.Playing, GameAction.Play, GamerState.WaitingForPlay),
//     new GamerTransition(GamerState.WaitingForPlay, GameAction.Over, GamerState.ViewingResult),
// ];

const {ccclass, property} = cc._decorator;
@ccclass
export default class GamerLogic extends cc.Component {

    @property(cc.Node)
    gameNode: cc.Node = null;

    private player: GameFramePlayer = null;
    private bundleClick: CardBundleClick = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.player = this.gameNode.getComponent(GameFramePlayer);
        this.bundleClick = this.node.getComponentInChildren(CardBundleClick);
    }

    start () {
        
    }

    onApprove(event:any, value: string) {
        this.player.sendAction(ActionFactory.build(GameAction.Approve, value == "true"));
    }

    onSuggest() {
        const game = VMUtil.getGameBean();
        const play = game.validPlayCurrentRound();
        let hand: CardHand = null;
        if (play) {
            hand = CardSuggestUtil.suggest(VMUtil.getMyself().cards, play.hand);
        } else {
            hand = CardSuggestUtil.suggest(VMUtil.getMyself().cards);
        }
        if (hand) {
            this.bundleClick.setSelected(hand.cards);
        } else { //提示要不起
            //TODO 
        }
    }

    /**
     * 出牌
     */
    onPlay() {
        const cards = this.bundleClick.getSelcted();
        if (cards.length > 0) {
            const game = VMUtil.getGameBean();
            const lastPlay = game.validPlayCurrentRound();
            const hand = lastPlay ? CardSuggestUtil.suggest(cards, lastPlay.hand) : CardRuleUtil.confirmType(cards);
            if (hand) {
                this.player.sendAction(ActionFactory.build(GameAction.Play, hand));
            } else {
                //TODO 提示出牌无效
                console.log()
            }
        }
        
    }

    /**
     * 不出
     */
    onNotPlay() {
        this.player.sendAction(ActionFactory.build(GameAction.Play, new CardHand([], [], CardUtil.Cards_Type_None)));
    }
    // update (dt) {}
}
