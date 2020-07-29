// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ActionBean from "../Bean/ActionBean";
import ActionExecutor from "../Action/ActionExecutor";
import SoundPlayer from "../Component/SoundPlayer";
import EventUtil from "../Util/EventUtil";
import VMUtil from "../Util/VMUtil";
import GameSchedule from "../Component/GameSchedule";
import CardBundleStatic from "../Cards/CardBundleStatic";
import CardBundleHidden from "../Cards/CardBundleHidden";
import Result from "../Component/Result";

/**
 * 游戏状态
 */
export enum GameState {
    Matching = 0, //匹配中
    Dealing = 1, //发牌中
    Approving = 2, //抢地主中
    Playing = 3, //出牌中
    GameOver = 4, //已结束
}

/**
 * 游戏动作
 */
export enum GameAction {
    Room = 0,//房间信息，用于房间初始化
    Deal = 1,//发牌
    Approve = 2,//抢地主
    DealAdditional = 3,//地主额外三张牌
    Play = 4,//出牌
    Suggest = 5,//建议出牌
    Over = 6,//结束
    Reset = 7,//重新开始
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameLogic extends cc.Component {

    // private gameBean: GameBean = VM.get<GameBean>("game").$data;
    

    // LIFE-CYCLE CALLBACKS:

    @property(cc.Node)
    myselfNode: cc.Node = null;
    @property(cc.Node)
    leftNode: cc.Node = null;
    @property(cc.Node)
    rightNode: cc.Node = null;
    @property(cc.Node)
    holeCardsNode: cc.Node = null;
    @property(cc.Node)
    resultNode: cc.Node = null;

    soundPlayer: SoundPlayer = null;
    gameSchedule: GameSchedule = null;

    onLoad () {
        this.soundPlayer = this.node.getComponentInChildren(SoundPlayer);
        this.gameSchedule = this.node.getComponent(GameSchedule);
        this.node.on(EventUtil.Game_State, () => {
            this.hideAll();
            let game = VMUtil.getGameBean();
            if (game.state >= GameState.Matching) {
                this.myselfNode.active = true;
                this.leftNode.active = true;
                this.rightNode.active = true;
                this.holeCardsNode.active = true;
            }
            if (game.state >= GameState.Playing) {
                this.holeCardsNode.getComponentInChildren(CardBundleHidden).setShow();
            }
            if (game.state == GameState.GameOver) {
                this.resultNode.active = true;
                this.resultNode.getComponent(Result).setData();
            }
        }, this);
        this.node.on(EventUtil.Game_Turn, () => {
            let game = VMUtil.getGameBean();
            this.gameSchedule.changeOrder(game.turnTotal, 0);
        });
        this.node.on(EventUtil.Game_HoleCards, () => {
            let game = VMUtil.getGameBean();
            this.holeCardsNode.getComponentInChildren(CardBundleHidden).setData(game.holeCards);
        }, this);
    }

    hideAll() {
        this.myselfNode.active = false;
        this.leftNode.active = false;
        this.rightNode.active = false;
        this.holeCardsNode.active = false;
        this.resultNode.active = false;
    }
    start () {
        this.hideAll();
    }


    //执行action
    updateAction (actionList: ActionBean<Object>[]): ActionBean<any>[] {
        const ret: ActionBean<any>[] = [];
        for (let i = 0; i < actionList.length; i ++) {
            let ab = new ActionExecutor(actionList[i], this.soundPlayer).execute(this.node);
            if (ab) {
                ret.push(ab);
            }
        }
        return ret;
    }

    back() {
        cc.director.loadScene("Welcome");
    }
}
