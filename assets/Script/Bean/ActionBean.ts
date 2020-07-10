// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameAction } from "../Logic/GameLogic";

export default class ActionBean<T> {
    /**
     * 动作
     */
    action: GameAction;
    /**
     * 该动作的数据
     */
    data: T;
    /**
     * 该动作的玩家，为空表示不需要玩家，比如发牌
     */
    order: number;
}
