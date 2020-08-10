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

    constructor() {
        
    }
}
