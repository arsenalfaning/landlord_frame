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
import { GameAction } from "../Logic/GameLogic";

export default class TexasUtil extends cc.Component {

    /**
     * 根据game的state设置gamer的state
     * @param game 
     */
    static setGamerStatus(game: TexasGameBean): boolean {
        if (game.state == GameState.PreFlop) {
            let index = game.bigBlindIndex + 1;
            index = TexasUtil.getValidIndex(game, index);
            if (index >= 0) {
                game.bettingIndex = index;
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
        amount = parseInt(amount.toString());
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

    /**
     * 变更游戏控制权
     * @param game
     * @param lastAction 
     */
    static changeActiveGamer(game: TexasGameBean, lastAction: GameAction): boolean {
        let state = GamerState.waiting;
        if (lastAction == GameAction.TexasBet) {
            state = GamerState.bet;
        } else if (lastAction == GameAction.TexasCall) {
            state = GamerState.call;
        } else if (lastAction == GameAction.TexasRaise) {
            state = GamerState.raise;
        } else if (lastAction == GameAction.TexasFold) {
            state = GamerState.fold;
        } else if (lastAction == GameAction.TexasCheck) {
            state = GamerState.check;
        }
        game.gamers[game.bettingIndex].state = state;
        game.gamers[game.bettingIndex].logic.updateUI();
        
        const index = TexasUtil.getValidIndex(game, game.bettingIndex + 1);
        if (index >= 0) {    
            game.bettingIndex = index;
            game.gamers[index].state = GamerState.betting;
            game.gamers[index].logic.updateUI();
            return true;
        } else {
            game.bettingIndex = -1;
        }
    }

    private static getValidIndex(game: TexasGameBean, index: number): number {
        const o = index;
        do {
            if (index >= game.gamers.length) {
                index = 0;
            }
            if (game.gamers[index].state != GamerState.fold && game.gamers[index].state != GamerState.allIn && game.gamers[index].point > 0) {
                if (game.gamers[index].betPoint && game.maxBetted) {
                    if (game.gamers[index].betPoint < game.maxBetted) {
                        return index;
                    } else {
                        break;
                    }
                }
                return index;
            }
            index ++;
        } while(index == o);

        return -1;
    }
}
