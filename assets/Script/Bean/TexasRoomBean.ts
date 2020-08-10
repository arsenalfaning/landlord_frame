// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TexasGamer from "./TexasGamer";


export default class TexasRoomBean {

    /**
     * 玩家
     */
    gamers: TexasGamer[];
    /**
     * 随机数种子
     */
    seed: number;
    /**
     * 洗牌随机数组
     */
    cards: number[];
}
