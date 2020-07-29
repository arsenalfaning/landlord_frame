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
import EventUtil from "../Util/EventUtil";
import GamerBean from "../Bean/GamerBean";
import CardBundleStatic from "../Cards/CardBundleStatic";

export enum GamerState {
    WaitingForMatch = 0,//等待匹配
    WaitingForDeal = 1,//等待发牌
    Approving = 8,//正在抢地主
    WaitingForApprove = 3,//等待别人抢地主
    Playing  = 9,//正在出牌
    WaitingForPlay  = 5,//等待别人出牌
    ViewingResult = 6,//查看游戏结果
}

const {ccclass, property} = cc._decorator;
@ccclass
export default class GamerLogic extends cc.Component {

    @property(cc.Node)
    gameNode: cc.Node = null;
    @property(cc.Node)
    playNode: cc.Node = null;
    @property(cc.Node)
    passButton: cc.Node = null;//不出按钮
    @property(cc.Node)
    approveNode: cc.Node = null;
    @property(cc.Node)
    approveStatusdNode: cc.Node = null;
    @property(cc.Node)
    clockNode: cc.Node = null;
    @property(cc.Node)
    playShowNode: cc.Node = null;
    @property(cc.Node)
    notPlayShowNode: cc.Node = null;
    @property(cc.Node)
    landlordNode: cc.Node = null;
    @property(cc.Node)
    cardsNode: cc.Node = null;
    @property(cc.Node)
    baseInfoNode: cc.Node = null;
    @property(cc.Node)
    qiangNode: cc.Node = null;
    @property(cc.Node)
    buQiangNode: cc.Node = null;
    @property(cc.Node)
    nameNode: cc.Node = null;
    @property(cc.Node)
    pointNode: cc.Node = null;

    @property
    gamerTag: string = "";

    private player: GameFramePlayer = null;
    private bundleClick: CardBundleClick = null;
    private bundleStatic: CardBundleStatic = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.player = this.gameNode.getComponent(GameFramePlayer);
        this.bundleClick = this.cardsNode.getComponent(CardBundleClick);
        this.bundleStatic = this.cardsNode.getComponent(CardBundleStatic);
        this.node.getParent().on(EventUtil.Gamer_State, (gamer: GamerBean) => {
            if (VMUtil.getGamerByTag(this.gamerTag) != gamer) return;
            this.hideAll();
            if (gamer.state == GamerState.WaitingForDeal) {
                this.nameNode.getComponent(cc.Label).string = gamer.gamerId;
                this.pointNode.getComponent(cc.Label).string = gamer.point + '';
            }
            if (gamer.state == GamerState.Playing) {
                this.setNodeActive(this.playNode, true);
                this.setNodeActive(this.playShowNode, false);
            }
            if (gamer.state == GamerState.Approving) {
                this.setNodeActive(this.approveNode, true);
            }
            if (gamer.state == GamerState.Playing || gamer.state == GamerState.Approving) {
                this.setNodeActive(this.clockNode, true);
            }
            if (gamer.state == GamerState.WaitingForPlay || gamer.state == GamerState.ViewingResult) {
                this.setNodeActive(this.playShowNode, true);
            }
            if (gamer.state == GamerState.WaitingForApprove) {
                this.setNodeActive(this.approveStatusdNode, true);
            }
        }, this);

        this.node.getParent().on(EventUtil.Gamer_Landlord, (gamer: GamerBean) => {
            if (VMUtil.getGamerByTag(this.gamerTag) != gamer) return;
            this.setNodeActive(this.landlordNode, gamer.landlord == 1);
        }, this);

        this.node.getParent().on(EventUtil.Gamer_Hand, (gamer: GamerBean) => {
            if (VMUtil.getGamerByTag(this.gamerTag) != gamer) return;
            if (gamer.state != GamerState.Playing) {
                this.setNodeActive(this.notPlayShowNode, gamer.notPlay == 1);
                this.setNodeActive(this.playShowNode, !!gamer.hand);
                this.playShowNode.getComponent(CardBundleStatic).setData(gamer.hand);
            }
        }, this);

        this.node.getParent().on(EventUtil.Game_Round, () => {
            let game = VMUtil.getGameBean();
            this.setNodeActive(this.passButton, game.playRoundCount > 0);
        }, this);

        this.node.getParent().on(EventUtil.Gamer_Cards, (gamer: GamerBean)=> {
            if (VMUtil.getGamerByTag(this.gamerTag) != gamer) return;
            let bundle = this.bundleClick ? this.bundleClick : this.bundleStatic;
            bundle.setData(gamer.cards);
        }, this);

        this.node.getParent().on(EventUtil.Gamer_Approve, (gamer: GamerBean) => {
            if (VMUtil.getGamerByTag(this.gamerTag) != gamer) return;
            this.setNodeActive(this.qiangNode, false);
            this.setNodeActive(this.buQiangNode, false);
            this.setNodeActive(this.qiangNode, gamer.approve == 1);
            this.setNodeActive(this.buQiangNode, gamer.approve == 0); 
        }, this);

        this.node.getParent().on(EventUtil.Game_Time, () => {
            let game = VMUtil.getGameBean();
            this.clockNode.getChildByName("Time").getComponent(cc.Label).string = game.time + '';
        }, this);

    }

    hideAll() {
        this.setNodeActive(this.playNode, false);
		this.setNodeActive(this.approveNode, false);
		this.setNodeActive(this.approveStatusdNode, false);
		this.setNodeActive(this.clockNode, false);
		this.setNodeActive(this.playShowNode, false);
		this.setNodeActive(this.notPlayShowNode, false);
    }

    setNodeActive(node: cc.Node, value: boolean) {
        if (node) {
            node.active = value;
        }
    }

    start () {
        this.hideAll();
        this.setNodeActive(this.qiangNode, false);
        this.setNodeActive(this.buQiangNode, false);
        this.setNodeActive(this.landlordNode, false);
    }

    onApprove(event:any, value: string) {
        this.player.sendAction(ActionFactory.build(GameAction.Approve, value == "true"));
    }

    onSuggest() {
        const game = VMUtil.getGameBean();
        const play = game.validPlayCurrentRound();
        let hand: CardHand = CardSuggestUtil.suggest(VMUtil.getMyself().cards, play ? play.hand : null);
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
            if (hand && hand.cards.length == cards.length) {
                this.player.sendAction(ActionFactory.build(GameAction.Play, hand));
            } else {
                //TODO 提示出牌无效
                console.log("出牌无效");
            }
        }
        
    }

    /**
     * 不出
     */
    onNotPlay() {
        this.bundleClick.setSelected([]);
        this.player.sendAction(ActionFactory.build(GameAction.Play, new CardHand([], [], CardUtil.Cards_Type_None)));
    }
    // update (dt) {}
}
