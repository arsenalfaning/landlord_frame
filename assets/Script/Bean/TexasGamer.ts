// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GamerState } from "../Logic/TexasGamerLogic";


export default class TexasGamer {

    /**
     * 用户的唯一标识
     */
    gamerId: string = "";
     /**
     * 积分
     */
    point: number = -1;
    /**
     * 手中剩余牌
     */
    cards: number[] = [];
     /**
     * 当前状态
     */
    state: GamerState = GamerState.waiting;
    
}
