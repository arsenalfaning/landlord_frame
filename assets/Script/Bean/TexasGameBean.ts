// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameState } from "../Logic/TexasGameLogic";
import TexasGamer from "./TexasGamer";


export default class TexasGameBean {

    /**
     * 游戏状态/阶段
     */
    state: GameState = GameState.PreFlop;
    /**
     * 已洗好的一副牌，不包括大小猫
     */
    deck: number[] = [];
    /**
     * 最小投注量
     */
    miniBet: number = 5;
    /**
     * 所有参与的玩家
     */
    gamers: TexasGamer[] = [];
    /**
     * 公共牌
     */
    publicCards: number[] = [];
    /**
     * 主池投注量
     */
    pot: number = 0;
    /**
     * 单个玩家当前轮已投最大值
     */
    maxBetted: number = 0;
    /**
     * 庄家index
     */
    buttonIndex: number = 0;
    /**
     * 当前投注玩家的index
     */
    bettingIndex: number = -1;
    /**
     * 玩家自己的index
     */
    myselfIndex: number = -1;
    /**
     * 小盲位
     */
    smallBlindIndex: number = 1;
    /**
     * 大盲位
     */
    bigBlindIndex: number = 2;
    /**
     * 投注map，key为玩家id，value为当前局累计投注量
     */
    betMap: Map<string, number> = new Map<string, number>();
    
    constructor() {
        
    }
}
