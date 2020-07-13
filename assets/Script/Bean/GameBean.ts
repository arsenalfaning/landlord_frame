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
            VMUtil.getGamers().forEach(gamer => {
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
            } else if (this.currentOrder == 0) {
                if (value) {
                    this.setLandlord(this.currentOrder);
                } else {
                    this.findAndSetLandlord();
                    return;
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
            } else {
                gamer.landlord = 0;
                gamer.state = GamerState.WaitingForPlay;
            }
        });
    }
}
