// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ActionBean from "../Bean/ActionBean";
import { GameAction, GameState } from "../Logic/GameLogic";
import RoomActionBean from "./RoomActionBean";
import VMUtil from "../Util/VMUtil";
import Random from "../Util/Random";
import ActionFactory from "./ActionFactory";
import { GamerState } from "../Logic/GamerLogic";
import DeckUtil from "../Util/DeckUtil";
import OrderUtil from "../Util/OrderUtil";
import CardHand from "../Util/CardHand";
import SoundPlayer from "../Component/SoundPlayer";
import EventUtil from "../Util/EventUtil";

export default class ActionExecutor {

    actionBean: ActionBean<any>;
    soundPlayer: SoundPlayer;

    constructor(actionBean: ActionBean<any>, soundPlayer: SoundPlayer) {
        this.actionBean = actionBean;
        this.soundPlayer = soundPlayer;
    }

    execute(node: cc.Node): ActionBean<any> {
        const game = VMUtil.getGameBean();
        if (this.actionBean.action == GameAction.Room) {//初始化房间数据
            if (game.state == GameState.Matching) {
                //1.接收数据
                const bean = this.actionBean as RoomActionBean;
                const myself = VMUtil.getMyself();
                const left = VMUtil.getLeft();
                const right = VMUtil.getRight();
                bean.data.gamers.forEach(e => {
                    if (e.gamerId == myself.gamerId) {
                        myself.order = e.order;
                        myself.point = e.point;
                    }
                });
                bean.data.gamers.forEach(g => {
                    g.state = GamerState.WaitingForDeal;
                    if (OrderUtil.isLeft(myself.order, g.order)) {
                        left.order = g.order;
                        left.gamerId = g.gamerId;
                        left.point = g.point;
                    } else if (OrderUtil.isRight(myself.order, g.order)) {
                        right.order = g.order;
                        right.gamerId = g.gamerId;
                        right.point = g.point;
                    }
                });
                myself.state = GamerState.WaitingForDeal;
                left.state = GamerState.WaitingForDeal;
                right.state = GamerState.WaitingForDeal;
                game.random = new Random(bean.data.seed);
                game.state = GameState.Dealing;
                node.emit(EventUtil.Game_State, game);
                node.emit(EventUtil.Gamer_State, myself);
                node.emit(EventUtil.Gamer_State, left);
                node.emit(EventUtil.Gamer_State, right);
                //2.发送发牌action
                return ActionFactory.build(GameAction.Deal);
            } else {
                console.warn("error game state:" + game.state + " for action room");
            }
        } else if (this.actionBean.action == GameAction.Deal) {//发牌
            if (game.state == GameState.Dealing) {
                //1.接收数据
                const gamers = VMUtil.getGamers();
                // const myself = VMUtil.getMyself();
                // const left = VMUtil.getLeft();
                // const right = VMUtil.getRight();
                const deck = DeckUtil.getdeck();
                DeckUtil.shuffle(deck, game.random);
                gamers.forEach(g => {
                    let cards = deck.slice(g.order * 17, (g.order + 1) * 17 );
                    DeckUtil.sort(cards);
                    g.cards = cards;
                    g.state = GamerState.WaitingForApprove;
                });
                const hole = deck.slice(51);
                DeckUtil.sort(hole);
                game.holeCards = hole;
                game.state = GameState.Approving;
                game.turn();
                node.emit(EventUtil.Game_State, game);
                node.emit(EventUtil.Game_HoleCards, game);
                node.emit(EventUtil.Game_Turn, game);
                gamers.forEach(g => {
                    node.emit(EventUtil.Gamer_State, g);
                    node.emit(EventUtil.Gamer_Cards, g);
                });
            } else {
                console.warn("error game state:" + game.state + " for action deal");
            }
        } else if (this.actionBean.action == GameAction.Approve) {//抢地主
            if (game.state == GameState.Approving) {
                //1.接收数据
                const value = this.actionBean.data as boolean;
                game.approve(value, this.soundPlayer);
                VMUtil.getGamers().forEach(g => {
                    node.emit(EventUtil.Gamer_State, g);
                    node.emit(EventUtil.Gamer_Cards, g);
                    node.emit(EventUtil.Gamer_Approve, g);
                    node.emit(EventUtil.Gamer_Landlord, g);
                });
                node.emit(EventUtil.Game_State, game);
                node.emit(EventUtil.Game_Turn, game);
            } else {
                console.warn("error game state:" + game.state + " for action approve");
            }
        } else if (this.actionBean.action == GameAction.Play) {//出牌
            if (game.state == GameState.Playing) {
                if (game.currentOrder == this.actionBean.order) {
                    //1.接收数据
                    const hand = this.actionBean.data as CardHand;
                    let action = game.playCards(hand, this.soundPlayer);
                    VMUtil.getGamers().forEach(g => {
                        node.emit(EventUtil.Gamer_State, g);
                        node.emit(EventUtil.Gamer_Hand, g);
                        node.emit(EventUtil.Gamer_Cards, g);
                    });
                    node.emit(EventUtil.Game_State, game);
                    node.emit(EventUtil.Game_Turn, game);
                    node.emit(EventUtil.Game_Round, game);
                    return action;
                } else {
                    console.warn("error play order:" + this.actionBean.order + " for action play while game's playing order is " + game.currentOrder);
                }
            } else  {
                console.warn("error game state:" + game.state + " for action play");
            }
        }
    }
}
