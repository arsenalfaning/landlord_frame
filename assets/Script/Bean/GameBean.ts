// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GamerBean from "./GamerBean";
import PlayBean from "./PlayBean";

export default class GameBean {

    // /**
    //  * 上家
    //  */
    // left: GamerBean = new GamerBean();
    // /**
    //  * 自己
    //  */
    // myself: GamerBean = new GamerBean();
    // /**
    //  * 下家
    //  */
    // right: GamerBean = new GamerBean();
    /**
     * 该轮出牌数组，索引越大，出牌越晚
     */
    playRound: PlayBean[] = [];
    /**
     * 所有出牌轮次历史
     */
    playRoundHistory: PlayBean[][] = [];
    /**
     * 服务器的时间
     */
    time: number;
    /**
     * 最近处理帧的版本号
     */
    version: number;
}
