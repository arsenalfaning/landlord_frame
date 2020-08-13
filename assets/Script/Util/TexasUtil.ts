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
import DeckUtil from "./DeckUtil";
import CardRuleUtil from "./CardRuleUtil";
import BetUtil from "./BetUtil";

export enum TexasCardsType {
    RoyalFlush = 1,//皇家同花顺
    StraightFlush = 2,//同花顺
    FourOfAKind = 3, //四条
    FullHouse = 4,//葫芦
    Flush = 5,//同花
    Straight = 6,//顺子
    ThreeOfAKind = 7,//三条
    TwoPairs = 8,//两对
    OnePair = 9,//一对
    HighCard = 10,//高牌
}

export class TexasCards {
    //类型
    type: TexasCardsType;
    /**
     * 牌数组
     */
    cards: number[] = [];
    /**
     * 生效的牌数组，四条里的四条
     */
    values: number[] = [];
    /**
     * 附带的牌数组，四条外的带牌
     */
    append: number[] = [];
}

export class TexasGamerResult {
    texasCards: TexasCards;
    isWinner: boolean;
    deltaPoint: number;
}

class TexasStyleCards {
    style1: number[] = [];
    style2: number[] = [];
    style3: number[] = [];
    style4: number[] = [];
}

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
        let v = game.betMap.get(gamer.gamerId);
        if (!v) v = 0;
        game.betMap.set(gamer.gamerId, v + amount);
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
            if (game.gamers[index].state != GamerState.fold && game.gamers[index].state != GamerState.check && game.gamers[index].state != GamerState.allIn && game.gamers[index].point > 0) {
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
        } while(index != o);

        return -1;
    }

    /**
     * 寻找第一个有效的index获取游戏控制权
     * @param game
     */
    static findFirstValidIndex(game: TexasGameBean): number {
        const o = parseInt(game.smallBlindIndex.toString());
        let index = o;
        do {
            if (index >= game.gamers.length) {
                index = 0;
            }
            const gamer = game.gamers[index];
            if (gamer.state != GamerState.fold && gamer.state != GamerState.allIn && gamer.state != GamerState.check && gamer.point > 0) {
                return index;
            }
            index ++;
        } while(index != o);

        return -1;
    }

    /**
     * 寻找最大牌
     * @param cards 七张牌，5张公共+2张手牌
     */
    static checkOutTexasCards(cards: number[]): TexasCards {
        DeckUtil.texasSort(cards);
        let tc: TexasCards = null;
        const styleCards = this._classifiedCards(cards);
        tc = this._checkRoyalFlush(styleCards);
        if (tc) return tc;
        tc = this._checkStraightFlush(styleCards);
        if (tc) return tc;
        tc = this._checkFourOfAKind(cards);
        if (tc) return tc;
        tc = this._checkFullHouse(cards);
        if (tc) return tc;
        tc = this._checkFlush(styleCards);
        if (tc) return tc;
        tc = this._checkStraight(cards);
        if (tc) return tc;
        tc = this._checkThreeOfAKind(cards);
        if (tc) return tc;
        tc = this._checkTwoPairs(cards);
        if (tc) return tc;
        tc = this._checkOnePair(cards);
        if (tc) return tc;
        return this._checkHighCard(cards);
    }

    /**
     * 根据牌的花色分类
     * @param cards 
     */
    static _classifiedCards(cards: number[]): TexasStyleCards {
        const style = new TexasStyleCards();
        cards.forEach( c => {
            style["style" + DeckUtil.style(c)].push(c);
        });
        return style;
    }

    /**
     * 寻找皇家同花顺
     * @param styleCards 
     */
    static _checkRoyalFlush(styleCards: TexasStyleCards): TexasCards{
        for (let prop in styleCards) {
            if (styleCards[prop].length >= 5) {
                const cards = styleCards[prop] as number[];
                if (DeckUtil.value(cards[0]) == 1) { //第一张是A
                    if ( CardRuleUtil.isTexasStraight(cards.slice(0, 5))) {
                        const result = new TexasCards();
                        result.type = TexasCardsType.RoyalFlush;
                        result.cards = cards.slice(0, 5);
                        result.values = result.cards;
                        return result;
                    }
                }
            }
        }
    }

    /**
     * 寻找同花顺
     * @param styleCards 
     */
    static _checkStraightFlush(styleCards: TexasStyleCards): TexasCards {
        for (let prop in styleCards) {
            if (styleCards[prop].length >= 5) {
                const cards = styleCards[prop] as number[];
                for (let i = 0; i <= cards.length - 5; i ++) {
                    let values = cards.slice(i, i + 5);
                    if (CardRuleUtil.isTexasStraight(values)) {
                        const result = new TexasCards();
                        result.type = TexasCardsType.StraightFlush;
                        result.cards = values;
                        result.values = result.cards;
                        return result;
                    }
                }
                if (DeckUtil.value(cards[0]) == 1 && DeckUtil.value(cards[cards.length -1]) == 2) {
                    let values = cards.slice(cards.length - 4, cards.length);
                    values.push(cards[0]);
                    if (CardRuleUtil.isTexasStraight(values)) {
                        const result = new TexasCards();
                        result.type = TexasCardsType.StraightFlush;
                        result.cards = values;
                        result.values = result.cards;
                        return result;
                    }
                }
            }
        }
    }

    /**
     * 寻找同花
     * @param styleCards 
     */
    static _checkFlush(styleCards: TexasStyleCards): TexasCards {
        for (let prop in styleCards) {
            if (styleCards[prop].length >= 5) {
                const cards = styleCards[prop] as number[];
                const result = new TexasCards();
                result.type = TexasCardsType.StraightFlush;
                result.cards = cards.slice(0, 5);
                result.values = result.cards;
                return result;
            }
        }
    }

    /**
     * 寻找四条
     * @param cards
     */
    static _checkFourOfAKind(cards: number[]): TexasCards {
        let r = CardRuleUtil._findNValueEqual(cards, 4);
        if (r) {
            const result = new TexasCards();
            result.type = TexasCardsType.FourOfAKind;
            result.values = r[0];
            result.append = [r[1][0]];
            result.cards = result.values.concat(result.append);
            return result;
        }
    }

    /**
     * 寻找葫芦
     * @param cards
     */
    static _checkFullHouse(cards: number[]): TexasCards {
        let r = CardRuleUtil._findNValueEqual(cards, 3);
        if (r) {
            let r1 = CardRuleUtil._findNValueEqual(r[1], 2);
            if (r1) {
                const result = new TexasCards();
                result.type = TexasCardsType.FullHouse;
                result.values = r[0].concat(r1[0]);
                result.append = [];
                result.cards =result.values;
                return result;
            }
        }
    }

    /**
     * 寻找顺子
     * @param cards 
     */
    static _checkStraight(cards: number[]): TexasCards {
        const validCards: number[] = [];
        cards.forEach(c => {
            let last = validCards[validCards.length - 1];
            if (last && DeckUtil.compareValue(last, c) == 0) {
            } else {
                validCards.push(c);
            }
        });
        if (validCards.length >= 5) {
            for (let i = 0; i <= validCards.length - 5; i ++) {
                let values = validCards.slice(i, i + 5);
                if (CardRuleUtil.isTexasStraight(values)) {
                    const result = new TexasCards();
                    result.type = TexasCardsType.Straight;
                    result.cards = values;
                    result.values = result.cards;
                    return result;
                }
            }
        }
    }

    /**
     * 寻找三条
     * @param cards 
     */
    static _checkThreeOfAKind(cards: number[]): TexasCards {
        const r = CardRuleUtil._findNValueEqual(cards, 3);
        if (r) {
            const result = new TexasCards();
            result.type = TexasCardsType.ThreeOfAKind;
            result.values = r[0];
            result.append = [r[1][0], r[1][1]];
            result.cards = result.values.concat(result.append);
            return result;
        }
    }

    /**
     * 寻找两对
     * @param cards 
     */
    static _checkTwoPairs(cards: number[]): TexasCards {
        const r = CardRuleUtil._findNValueEqual(cards, 2);
        if (r) {
            const r1 = CardRuleUtil._findNValueEqual(r[1], 2);
            if (r1) {
                const result = new TexasCards();
                result.type = TexasCardsType.TwoPairs;
                result.values = r[0].concat(r1[0]);
                result.append = [r1[1][0]];
                result.cards = result.values.concat(result.append);
                return result;
            }
        }
    }

    /**
     * 寻找一对
     * @param cards 
     */
    static _checkOnePair(cards: number[]): TexasCards {
        const r = CardRuleUtil._findNValueEqual(cards, 2);
        if (r) {
            const result = new TexasCards();
            result.type = TexasCardsType.OnePair;
            result.values = r[0];
            result.append = [r[1][0], r[1][1], r[1][2]];
            result.cards = result.values.concat(result.append);
            return result;
        }
    }

    /**
     * 寻找高牌
     * @param cards 
     */
    static _checkHighCard(cards: number[]): TexasCards {
        const result = new TexasCards();
        result.type = TexasCardsType.HighCard;
        result.values = cards.slice(0, 5);
        result.cards = result.values;
        return result;
    }

    /**
     * 比较两副牌的大小
     * @param c1 
     * @param c2 
     */
    static compareTexasCards(c1: TexasCards, c2: TexasCards): number {
        if (c1.type == c2.type) {
            for (let i = 0; i < 5; i ++) {
                let delta = DeckUtil.texasCompareValue(c1.cards[i], c2.cards[i]);
                if (delta != 0) return delta;
            }
            return 0;
        } else {
            return c2.type - c1.type;
        }
    }

    /**
     * 计算当局游戏结果
     * @param game 
     */
    static calculateResult(game: TexasGameBean) {
        let arr: TexasGamer[] = [];
        game.gamers.forEach(g => {
            g.result = new TexasGamerResult();
            g.result.texasCards = this.checkOutTexasCards(g.cards.concat(game.publicCards));
            arr.push(g);
        });
        arr.sort((a, b) => {
            return -this.compareTexasCards(a.result.texasCards, b.result.texasCards); 
        });
        const winners: Set<string> = new Set<string>();
        arr.forEach(g => {
            g.result.isWinner = this.compareTexasCards(g.result.texasCards, arr[0].result.texasCards) == 0;
            if (g.result.isWinner) {
                winners.add(g.gamerId);
            }
        });
        BetUtil.addSidePot(0, game.pot, game.gamers.map(g => g.gamerId), game.betMap);
        const map = BetUtil.caculateResult(winners);
        arr.forEach(g => {
            g.result.deltaPoint = - ( game.betMap.get(g.gamerId) ? game.betMap.get(g.gamerId) : 0);
            if (map.has(g.gamerId)) {
                g.result.deltaPoint += map.get(g.gamerId);
            }
        });
        console.log(arr);
    }
}
