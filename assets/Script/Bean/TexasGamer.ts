// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TexasGamerLogic, { GamerState } from "../Logic/TexasGamerLogic";
import { TexasGamerResult } from "../Util/TexasUtil";


export default class TexasGamer {

    /**
     * 用户的唯一标识
     */
    gamerId: string = "";
     /**
     * 积分（可用）
     */
    point: number = -1;
    /**
     * 当前游戏投注的积分
     */
    betPoint: number = 0;
    /**
     * 手中剩余牌
     */
    cards: number[] = [];
     /**
     * 当前状态
     */
    state: GamerState = GamerState.waiting;
    /**
     * ui控制
     */
    logic: TexasGamerLogic = null;
    /**
     * 当前局游戏结果
     */
    result: TexasGamerResult = null;
}
