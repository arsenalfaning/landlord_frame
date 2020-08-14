// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SidePotBean from "../Bean/SidePotBean";

export default class BetUtil {

    private static sidePotList: SidePotBean[] = [];
    

    /**
     * 初始化
     */
    public static init() {
        BetUtil.sidePotList = [];
    }

    /**
     * 添加新的边池
     * @param sidePot 
     */
    public static addSidePot(start: number, end: number, gamers: string[], betMap: Map<string, number>) {
        let sidePot: SidePotBean = new SidePotBean();
        sidePot.betMap = new Map<string, number>(betMap);
        sidePot.end = end;
        sidePot.start = start;
        sidePot.gamers = gamers;
        BetUtil.sidePotList.push(sidePot);
    }

    /**
     * 计算结果
     * @param winners 
     */
    public static caculateResult(winners: Set<string>): Map<string, number> {
        const map = new Map<string, number>();
        let dividePoint = 0;
        BetUtil.sidePotList.forEach(e => {
            let winner = e.gamers.filter(g => winners.has(g));
            if (winner.length > 0) {
                let delta = (e.end - dividePoint) / winner.length;
                winner.forEach(w => {
                    let v = delta;
                    if (map.has(w)) {
                        v += map.get(w);
                    }
                    map.set(w, v);
                });
                dividePoint = e.end;
            }
        });
        let lastSiePot = BetUtil.sidePotList[BetUtil.sidePotList.length - 1];
        if (lastSiePot.end > dividePoint) {//需要退还部分投注
            BetUtil.sidePotList.filter(s => s.start >= dividePoint).forEach(s => {
                s.betMap.forEach((bet, gamer) => {
                    let v = bet;
                    if (map.has(gamer)) {
                        v += map.get(gamer);
                    }
                    map.set(gamer, v);
                });
            });
        }
        BetUtil.sidePotList = [];
        return map;
    }
}
