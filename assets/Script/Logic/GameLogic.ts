// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameFrame from "../Net/GameFrame";
import ActionBean from "../Bean/ActionBean";
import ActionExecutor from "../Action/ActionExecutor";

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

    onLoad () {
        
    }

    start () {
        
    }

    //执行action
    updateAction (actionList: ActionBean<Object>[]): ActionBean<any>[] {
        const ret: ActionBean<any>[] = [];
        for (let i = 0; i < actionList.length; i ++) {
            let ab = new ActionExecutor(actionList[i]).execute();
            if (ab) {
                ret.push(ab);
            }
        }
        return ret;
    }
}
