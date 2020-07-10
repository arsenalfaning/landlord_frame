// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameFrame from "../Net/GameFrame";
import GameBean from "../Bean/GameBean";
import { VM } from "../ViewModel/ViewModel";
import WebSocketBean from "../Net/WebSocketBean";

/**
 * 游戏状态
 */
enum GameState {
    Matching = 0, //匹配中
    Approving = 1, //抢地主中
    Playing = 2, //出牌中
    GameOver = 3, //已结束
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
    private socket: WebSocketBean;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.socket.connect();
    }

    start () {
        
    }

    //帧同步
    updateByNet (frame: GameFrame<Object>) {
        if (frame.a && frame.a.length > 0) {
            
        }
    }

    onDestroy() {
        this.socket.onClose();
    }
}
