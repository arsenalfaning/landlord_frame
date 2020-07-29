// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CardHand from "./CardHand";
import CardUtil from "./CardUtil";
import DeckUtil from "./DeckUtil";

/**
 * 出牌规则相关
 */
export default class CardRuleUtil {
    

    /**
     * 判断手牌是何类型，用于首次出牌，如果返回null，表明不符合出牌规则
     * @param cards 牌数组
     */
    static confirmType(cards: number[]): CardHand {
        if (!cards || cards.length == 0) {
            return new CardHand([], [], CardUtil.Cards_Type_None);
        } else if (cards.length == 1) {//单张牌
            return new CardHand(cards, [], CardUtil.Cards_Type_Single);
        } else if (cards.length == 2) {
            if (this._isJokerBomb(cards)) {
                return new CardHand(cards, [], CardUtil.Cards_Type_Joker_Bomb);
            }
            if (this._isAllValueEqual(cards)) {
                return new CardHand(cards, [], CardUtil.Cards_Type_Double);
            }
        } else if (cards.length == 3) {
            return this._checkTriple(cards);
        } else if (cards.length == 4) {
            return this._checkBomb(cards) || this._checkTriple(cards);
        } else if (cards.length == 5) {
            return this._checkTriple(cards) || this._checkStraight(cards);
        } else if (cards.length >= 6 && cards.length <= 8) {
            return this._checkQuadruple(cards) || this._checkStraight(cards) || this._checkDoubleStraight(cards) || this._checkTripleStraight(cards);
        } else if (cards.length >= 9 && cards.length <= 12) {
            return this._checkStraight(cards) || this._checkDoubleStraight(cards) || this._checkTripleStraight(cards);
        } else {
            return this._checkDoubleStraight(cards) || this._checkTripleStraight(cards);
        }
    }

    /**
     * 判断三带一或者三带一对
     * @param cards 
     */
    static _checkTriple(cards: number[]): CardHand {
        let arr = this._findNValueEqual(cards, 3);
        console.log(arr);
        if (arr) {
            if (arr[1].length == 0) {
                return new CardHand(arr[0], arr[1], CardUtil.Cards_Type_Triple); //三张
            } else if (arr[1].length == 1) {
                return new CardHand(arr[0], arr[1], CardUtil.Cards_Type_Triple_Append_Single); //三带一
            } else if (arr[1].length == 2) {
                if (this._isAllValueEqual(arr[1])) {
                    return new CardHand(arr[0], arr[1], CardUtil.Cards_Type_Triple_Append_Double); //三带一对
                }
            }
        }
    }

    /**
     * 判断炸弹
     * @param cards 
     */
    static _checkBomb(cards: number[]): CardHand {
        if (this._isAllValueEqual(cards)) {
            return new CardHand(cards, [], CardUtil.Cards_Type_Bomb);
        }
    }

    /**
     * 判断四带二或者四带两对
     * @param cards 
     */
    static _checkQuadruple(cards: number[]): CardHand {
        let arr = this._findNValueEqual(cards, 4);
        if (arr) {
            if (arr[1].length == 2) {
                return new CardHand(arr[0], arr[1], CardUtil.Cards_Type_Quadruple_Append_Two_Single); //四带二
            } else if (arr[1].length == 4) {
                if (this._isAllValueEqual(arr[1].slice(0,2)) && this._isAllValueEqual(arr[1].slice(2))) {
                    return new CardHand(arr[0], arr[1], CardUtil.Cards_Type_Quadruple_Append_Two_Double); //四带两对
                }
            }
        }
    }

    /**
     * 判断是顺子
     * @param cards 
     */
    static _checkStraight(cards: number[]): CardHand {
        if (this._isNStraight(cards, 1)) {
            return new CardHand(cards, [], CardUtil.Cards_Type_Straight);
        }
    }

    /**
     * 判断是连对
     * @param cards 
     */
    static _checkDoubleStraight(cards: number[]): CardHand {
        if (this._isNStraight(cards, 2)) {
            return new CardHand(cards, [], CardUtil.Cards_Type_Double_Straight);
        }
    }

    /**
     * 判断是飞机
     * @param cards 
     */
    static _checkTripleStraight(cards: number[]): CardHand {
        let values = [];
        let valueSet = new Set();
        for (let i = 0; i < cards.length - 2;) {
            if (DeckUtil.compareValue(cards[i], cards[i + 2]) == 0) {
                let arr = cards.slice(i, i + 3);
                values = values.concat(arr);
                arr.forEach(e => valueSet.add(e));
                i += 3;
            } else {
                i ++;
            }
        }
        let append = cards.filter(e => !valueSet.has(e));
        if (this._isNStraight(values, 3)) {
            if (append.length == 0) {
                return new CardHand(values, append, CardUtil.Cards_Type_Triple_Straight);
            } else if (append.length == values.length / 3) {
                return new CardHand(values, append, CardUtil.Cards_Type_Triple_Straight_Append_Single);
            } else if (append.length == values.length * 2 / 3) {
                let flag = true;
                for (let j = 0; j < append.length - 1; j +=2) {
                    if (DeckUtil.compareValue(append[j], append[j + 1]) != 0) {
                        flag = false;
                    }
                }
                if (flag) {
                    return new CardHand(values, append, CardUtil.Cards_Type_Triple_Straight_Append_Double);
                }
            }
        }
    }

    /**
     * 判断几张牌面值是否相等
     * @param cards 
     */
    static _isAllValueEqual(cards: number[]): boolean {
        return DeckUtil.compareValue(cards[0], cards[cards.length - 1]) == 0;
    }

    /**
     * 判断是否是王炸
     * @param cards 
     */
    static _isJokerBomb(cards: number[]): boolean {
        return cards.length == 2 && cards[0] == DeckUtil.Card_Red_Joker && cards[1] == DeckUtil.Card_Black_Joker;
    }
    /**
     * 判断是否是顺子
     * @param cards 
     */
    static _isNStraight(cards: number[], n: number): boolean {
        for (let i = 0; i < cards.length - n; i += n) {
            if ( DeckUtil.compareValue(cards[i], cards[i + n]) != 1 || DeckUtil.compareValue(cards[i], cards[i + n - 1]) != 0 ) {
                return false;
            }
        }
        return true;
    }

    /**
     * 查找n张相同面值的牌
     * @param cards 
     * @param n 
     */
    static _findNValueEqual(cards: number[], n: number): number[][] {
        for (let i = 0; i <= cards.length - n; i ++) {
            if ( DeckUtil.compareValue(cards[i], cards[i + n - 1]) == 0) {
                return [cards.slice(i, i + n), cards.slice(0, i).concat(cards.slice(i + n))];
            }
        }
        return null;
    }

}
