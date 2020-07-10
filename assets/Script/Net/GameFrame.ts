// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ActionBean from "../Bean/ActionBean";


/**
 * 游戏帧，暂定每秒20帧
 */
export default class GameFrame<T> {

    /**
     * 该帧的版本号，应该是连续的
     */
    v: number;
    /**
     * 该帧产生时的服务器时间
     */
    t: number;
    /**
     * 动作数组
     */
    a: ActionBean<T>[];
}
