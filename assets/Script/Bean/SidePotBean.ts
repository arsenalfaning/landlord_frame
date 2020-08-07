// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 边池
 */
export default class SidePotBean {
    start: number;
    end: number;
    gamers: string[] = [];//投注量大于end的所有玩家id
    betMap: Map<string, number> = new Map<string, number>();//投注量start~end之间的投注分布
}
