// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GamerState } from "../Logic/GamerLogic";

export default class GamerBean {

    /**
     * 用户的唯一标识
     */
    gamerId: string = "";
    /**
     * 出牌顺序
     */
    order: number = -1;
    /**
     * 积分
     */
    point: number = -1;
    /**
     * 手中剩余牌
     */
    cards: number[] = [];
    
    /**
     * 是否是地主
     */
    landlord: number = 0;
    /**
     * 当前状态
     */
    state: GamerState = GamerState.WaitingForMatch;
    /**
     * 当前展示的出牌
     */
    hand: number[] = [];
    /**
     * 不出
     */
    notPlay: number = 0;
    /**
     * 游戏结果
     */
    pointDelta: number = 0;
}
