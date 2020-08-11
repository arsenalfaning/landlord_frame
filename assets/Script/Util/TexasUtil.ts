// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TexasGameBean from "../Bean/TexasGameBean";
import { GameState } from "../Logic/TexasGameLogic";
import { GamerState } from "../Logic/TexasGamerLogic";
import TexasGamer from "../Bean/TexasGamer";

export default class TexasUtil extends cc.Component {

    /**
     * 根据game的state设置gamer的state
     * @param game 
     */
    static setGamerStatus(game: TexasGameBean): boolean {
        if (game.state == GameState.PreFlop) {
            let index = game.bigBlindIndex + 1;
            index = TexasUtil._getValidIndex(game, index);
            if (index >= 0) {
                game.gamers[index].state = GamerState.betting;
                game.gamers[game.smallBlindIndex].state = GamerState.smallBlind;
                game.gamers[game.bigBlindIndex].state = GamerState.bigBlind;
                return true;
            }
        }
    }

    /**
     * 进行投注
     * @param game 
     * @param gamer 
     * @param amount 
     */
    static doBet(game: TexasGameBean, gamer: TexasGamer, amount: number): boolean {
        if (gamer.point < amount) {
            return false;
        }
        if (!gamer.betPoint) {
            gamer.betPoint = 0;
        }
        gamer.betPoint += amount;
        gamer.point -= amount;
        if (gamer.betPoint > game.maxBetted) {
            game.maxBetted = gamer.betPoint;
        }
        game.pot += amount;
        return true;
    }

    private static _getValidIndex(game: TexasGameBean, index: number): number {
        const o = index;
        do {
            if (index >= game.gamers.length) {
                index = 0;
            }
            if (game.gamers[index].point > 0) {
                return index;
            }
            index ++;
        } while(index == o);

        return -1;
    }
}
