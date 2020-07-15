// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PlayBean from "./PlayBean";
import Random from "../Util/Random";
import { GameState } from "../Logic/GameLogic";
import OrderUtil from "../Util/OrderUtil";
import VMUtil from "../Util/VMUtil";
import { GamerState } from "../Logic/GamerLogic";
import CardUtil from "../Util/CardUtil";
import CardHand from "../Util/CardHand";
import GamerBean from "./GamerBean";
import CardSuggestUtil from "../Util/CardSuggestUtil";
import DeckUtil from "../Util/DeckUtil";

export default class GameBean {

    /**
     * 地主底牌
     */
    holeCards: number[] = [];
    /**
     * 该轮出牌数组，索引越大，出牌越晚
     */
    playRound: PlayBean[] = [];
    /**
     * 该轮出牌已出的手
     */
    playRoundCount: number = 0;
    /**
     * 所有出牌轮次历史
     */
    playRoundHistory: PlayBean[][] = [];
    /**
     * 随机数生成工具类
     */
    random: Random;
    /**
     * 游戏状态
     */
    state: GameState = GameState.Matching;
    /**
     * 当前出牌者的order
     */
    currentOrder: number = 99;
    /**
     * 抢地主历史
     */
    approveHistory: boolean[] = [];

    /**
     * 判断回合属于哪个order
     */
    turn() {
        this.currentOrder = OrderUtil.nextOrder(this.currentOrder);
        if (this.state == GameState.Approving) {
            VMUtil.getGamers().forEach(gamer => {
                if (gamer.order == this.currentOrder) {
                    gamer.state = GamerState.Approving;
                } else {
                    gamer.state = GamerState.WaitingForApprove;
                }
            });
        } else if (this.state == GameState.Playing) {
            const gamers = VMUtil.getGamers();
            gamers.forEach(gamer => {
                if (gamer.order == this.currentOrder) {
                    gamer.state = GamerState.Playing;
                } else {
                    gamer.state = GamerState.WaitingForPlay;
                }
            });
        }
    }

    /**
     * 执行抢地主动作
     * @param value 
     */
    approve(value: boolean) {
        //1.记录历史
        this.approveHistory[this.currentOrder] = value;
        //2.查看历史数据，判断是否满足结束条件
        if (this.approveHistory.length == 3) {
            if (!this.approveHistory[0]) {
                this.findAndSetLandlord();
                return;
            } else {
                if (this.currentOrder == 0) {
                    if (value) {
                        this.setLandlord(this.currentOrder);
                        return;
                    } else {
                        this.findAndSetLandlord();
                        return;
                    }
                } else {
                    if (this.approveHistory[0] && !this.approveHistory[1] && !this.approveHistory[2]) {
                        this.findAndSetLandlord();
                        return;
                    } else {
                        this.turn();
                    }
                    
                }
            }
        } else {
            this.turn();
        }
    }

    /**
     * 获取当前出牌轮次的最后一手有效出牌
     */
    validPlayCurrentRound(): PlayBean{
        for (let i = this.playRound.length - 1; i >= 0; i --) {
            if (this.playRound[i].hand.type != CardUtil.Cards_Type_None) {
                return this.playRound[i];
            }
        }
        return;
    }

    /**
     * 执行出牌
     */
    playCards(hand: CardHand): boolean {
        const gamers = VMUtil.getGamers();
        const playingGamer = gamers.filter(e => e.order == this.currentOrder)[0];
        //0.要不起且不是发牌，则执行出牌
        if (hand.type == CardUtil.Cards_Type_None && this.playRound.length > 0) {
            this.doPlayCards(hand, playingGamer);
            return true;
        }
        let flag = true;
        //1.判断是否比前一次出牌大
        const lastPlay = this.validPlayCurrentRound();
        if (lastPlay) {
            const sh = CardSuggestUtil.suggest(hand.cards, lastPlay.hand);
            flag = sh && sh.cards.length == hand.cards.length && CardHand.compareTo(hand, lastPlay.hand) > 0;
        }
        //2.判断是否有牌
        if (flag) {
            let count = 0;
            const cardsMap = new Map<number, boolean>();
            playingGamer.cards.forEach(e => cardsMap.set(e, false));
            hand.cards.forEach(e => {
                if (cardsMap.has(e) && cardsMap.get(e) == false) {
                    cardsMap.set(e, true);
                    count ++;
                } else {
                    flag = false;
                }
            });
            flag = flag && count == hand.cards.length;
        }
        //3.执行出牌
        if (flag) {
            this.doPlayCards(hand, playingGamer);
        }
        return flag;
    }

    private doPlayCards(hand: CardHand, gamer: GamerBean) {
        const pb = new PlayBean();
        const gamers = VMUtil.getGamers();
        pb.hand = hand;
        pb.order = gamer.order;
        gamer.hand = hand.cards;
        this.playRound.push(pb);
        this.playRoundCount = this.playRound.length;
        if (hand.cards.length > 0) { //删除出掉的牌
            const cSet = new Set<number>();
            hand.cards.forEach(e => cSet.add(e));
            let newCards = gamer.cards.filter(c => !cSet.has(c));
            gamer.cards = newCards;
            gamer.notPlay = 0;
        } else {
            gamer.notPlay = 1;
        }
        if (this.isGameOver(gamers)) {
            //TODO 执行结束
            this.state = GameState.GameOver;
            gamers.forEach(g => g.state = GamerState.ViewingResult);
        } else {
            this.turn();
            const lastPlay = this.validPlayCurrentRound();
            if (lastPlay.order == this.currentOrder) {//转了一圈没人要
                this.playRoundHistory.push(this.playRound);
                this.playRound = [];
                this.playRoundCount = this.playRound.length;
                gamers.forEach(g => {g.hand = null;g.notPlay = 0;});
            }
        }
    }

    /**
     * 判断游戏是否满足结束条件
     */
    private isGameOver(gamers: GamerBean[]): boolean {
        return gamers.filter(e => e.cards.length == 0).length > 0
    }

    private findAndSetLandlord() {
        for (let i = 2; i >= 0; i --) {
            if (this.approveHistory[i]) {
                this.setLandlord(i);
                return;
            }
        }
    }

    private setLandlord(order: number) {
        VMUtil.getGamers().forEach(gamer => {
            if (gamer.order == order) {
                gamer.landlord = 1;
                gamer.state = GamerState.Playing;
                const nc = gamer.cards.concat(this.holeCards);
                DeckUtil.sort(nc);
                gamer.cards =  nc;
            } else {
                gamer.landlord = 0;
                gamer.state = GamerState.WaitingForPlay;
            }
        });
        this.state = GameState.Playing;
        this.currentOrder = order;
    }
}
