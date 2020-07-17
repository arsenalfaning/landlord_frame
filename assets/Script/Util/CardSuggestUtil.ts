// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CardHand from "./CardHand";
import CardUtil from "./CardUtil";
import DeckUtil from "./DeckUtil";
import CardRuleUtil from "./CardRuleUtil";

export default class CardSuggestUtil {

    /**
     * 建议出牌
     * @param cards 玩家手里所有的牌
     * @param lastHand 上一手有效出牌
     */
    static suggest(cards: number[], lastHand?: CardHand): CardHand {
        if (lastHand && lastHand.type == CardUtil.Cards_Type_Joker_Bomb) { //对方是王炸
            return null;
        }
        let cs = this._findValueEqualList(cards);
        if (!lastHand) return this._suggestMin(cs);
        let out : CardHand;
        switch(lastHand.type) {
            case CardUtil.Cards_Type_Joker_Bomb:
                return null;
            case CardUtil.Cards_Type_Bomb:
                return this._suggestBombOrJokerBomb(cs, lastHand);
            case CardUtil.Cards_Type_Single:
                out = this._suggestSingle(cs, lastHand);
                break;
            case CardUtil.Cards_Type_Double:
                out = this._suggestDouble(cs, lastHand);
                break;
            case CardUtil.Cards_Type_Triple:
            case CardUtil.Cards_Type_Triple_Append_Single:
            case CardUtil.Cards_Type_Triple_Append_Double:
                out = this._suggestTriple(cs, lastHand);
                break;
            case CardUtil.Cards_Type_Quadruple_Append_Two_Single:
            case CardUtil.Cards_Type_Quadruple_Append_Two_Double:
                out = this._suggestQuadruple(cs, lastHand);
                break;
            case CardUtil.Cards_Type_Straight:
            case CardUtil.Cards_Type_Double_Straight:
            case CardUtil.Cards_Type_Triple_Straight:
            case CardUtil.Cards_Type_Triple_Straight_Append_Single:
            case CardUtil.Cards_Type_Triple_Straight_Append_Double:
                out = this._suggestStraight(cs, lastHand);
                break;
        }
        return out || this._suggestBombOrJokerBomb(cs, lastHand);
    }

    /**
     * 建议首次出牌
     * @param cs 
     */
    static _suggestMin(cs: CardSorted): CardHand {
        let hand: CardHand = null;
        if (cs.singleArray.length > 0) {
            hand = new CardHand([cs.singleArray.pop()], [], CardUtil.Cards_Type_Single); 
        } 
        if (cs.doubleArray.length > 0) {
            const cards = cs.doubleArray.pop();
            hand = new CardHand(cards, [], CardUtil.Cards_Type_Double); 
        }
        if (cs.tripleArray.length > 0) {
            const cards = cs.tripleArray.pop();
            hand = new CardHand(cards, [], CardUtil.Cards_Type_Triple);
        }
        if (!hand && cs.quadrupleArray.length > 0) {
            hand = new CardHand(cs.quadrupleArray.pop(), [], CardUtil.Cards_Type_Bomb);
        }
        return hand;
    }

    /**
     * 建议单张
     * @param cs
     * @param lastHand 
     */
    static _suggestSingle(cs: CardSorted, lastHand: CardHand): CardHand {
        for (let i = cs.singleArray.length - 1; i >= 0; i --) {
            if (DeckUtil.compareValue(cs.singleArray[i], lastHand.values[0]) > 0) {
                return new CardHand([cs.singleArray[i]], [], CardUtil.Cards_Type_Single); 
            }
        }
        for (let i = cs.doubleArray.length - 1; i >= 0; i --) {
            if (DeckUtil.compareValue(cs.doubleArray[i][0], lastHand.values[0]) > 0) {
                return new CardHand([cs.doubleArray[i][0]], [], CardUtil.Cards_Type_Single); 
            }
        }
        for (let i = cs.tripleArray.length - 1; i >= 0; i --) {
            if (DeckUtil.compareValue(cs.tripleArray[i][0], lastHand.values[0]) > 0) {
                return new CardHand([cs.tripleArray[i][0]], [], CardUtil.Cards_Type_Single); 
            }
        }
    }

    /**
     * 建议对
     * @param cs
     * @param lastHand 
     */
    static _suggestDouble(cs: CardSorted, lastHand: CardHand): CardHand {
        for (let i = cs.doubleArray.length - 1; i >= 0; i --) {
            if (DeckUtil.compareValue(cs.doubleArray[i][0], lastHand.values[0]) > 0) {
                return new CardHand(cs.doubleArray[i], [], CardUtil.Cards_Type_Double); 
            }
        }
        for (let i = cs.tripleArray.length - 1; i >= 0; i --) {
            if (DeckUtil.compareValue(cs.tripleArray[i][0], lastHand.values[0]) > 0) {
                return new CardHand([cs.tripleArray[i][0], cs.tripleArray[i][1]], [], CardUtil.Cards_Type_Double); 
            }
        }
    }

    /**
     * 建议三张
     * @param cs
     * @param lastHand 
     */
    static _suggestTriple(cs: CardSorted, lastHand: CardHand): CardHand {
        let values: number[];
        for (let i = cs.tripleArray.length - 1; i >= 0; i --) {
            if (DeckUtil.compareValue(cs.tripleArray[i][0], lastHand.values[0]) > 0) {
                values = cs.tripleArray[i];
                break;
            }
        }
        if (values) {
            let set = new Set<number>();
            values.forEach(e => set.add(e));
            let append: number[] = [];
            if (lastHand.append.length == 1) {
                if (cs.singleArray.length > 0) {
                    append.push(cs.singleArray[cs.singleArray.length - 1]);
                } else if (cs.doubleArray.length > 0) {
                    append.push(cs.doubleArray[cs.doubleArray.length - 1][0]);
                } else if (cs.tripleArray.length > 0) {
                    for (let i = 0; i < cs.tripleArray.length; i ++) {
                        if (!set.has(cs.tripleArray[i][0])) {
                            append.push(cs.tripleArray[i][0]);
                            break;
                        }
                    }
                } else {
                    return;
                }
            } else if (lastHand.append.length == 2) {
                if (cs.doubleArray.length > 0) {
                    append = append.concat(cs.doubleArray[cs.doubleArray.length - 1]);
                } else if (cs.tripleArray.length > 0) {
                    for (let i = 0; i < cs.tripleArray.length; i ++) {
                        if (!set.has(cs.tripleArray[i][0])) {
                            append = append.concat(cs.tripleArray[i]);
                            break;
                        }
                    }
                } else {
                    return;
                }
            }
            return new CardHand(values, append, lastHand.type);
        }
    }
    /**
     * 建议四带二或者四带两对
     * @param cs 
     * @param lastHand 
     */
    static _suggestQuadruple(cs: CardSorted, lastHand: CardHand): CardHand {
        let values: number[];
        for (let i = cs.quadrupleArray.length - 1; i >= 0; i --) {
            if (DeckUtil.compareValue(cs.quadrupleArray[i][0], lastHand.values[0]) > 0) {
                values = cs.quadrupleArray[i];
                break;
            }
        }
        if (values) {
            let set = new Set<number>();
            values.forEach(e => set.add(e));
            let append: number[] = [];
            if (lastHand.append.length == 2) {
                if (cs.singleArray.length >= 2) {
                    append = append.concat([cs.singleArray[cs.singleArray.length - 2], cs.singleArray[cs.singleArray.length - 1] ]);
                } else if (cs.doubleArray.length > 0) {
                    append = append.concat(cs.doubleArray[cs.doubleArray.length - 1]);
                } else if (cs.tripleArray.length > 0) {
                    append = append.concat(cs.tripleArray[cs.tripleArray.length - 1].slice(0, 2));
                } else {
                    return;
                }
            } else if (lastHand.append.length == 4) {
                if (cs.doubleArray.length >= 2) {
                    append = append.concat(cs.doubleArray[cs.doubleArray.length - 2]);
                    append = append.concat(cs.doubleArray[cs.doubleArray.length - 1]);
                } else if (cs.tripleArray.length >= 2) {
                    append = append.concat(cs.tripleArray[cs.tripleArray.length - 2].slice(0, 2));
                    append = append.concat(cs.tripleArray[cs.tripleArray.length - 1].slice(0, 2));
                } else {
                    return;
                }
            }
            return new CardHand(values, append, lastHand.type);
        }
    }

    /**
     * 建议顺子、连对或者飞机
     * @param cs
     * @param lastHand 
     */
    static _suggestStraight(cs: CardSorted, lastHand: CardHand): CardHand {
        if (lastHand.type == CardUtil.Cards_Type_Straight) {
            let list = [].concat(cs.singleArray);
            cs.doubleArray.forEach(e => list.push(e[0]));
            cs.tripleArray.forEach(e => list.push(e[0]));
            if (list.length < lastHand.values.length) return;
            DeckUtil.sort(list);
            let values: number[] = [];
            for (let i = list.length - 1; i >= 1; i --) {
                if (DeckUtil.compareValue(list[i], lastHand.values[lastHand.values.length - 1]) > 0 && DeckUtil.compareValue(list[i], list[i - 1]) == -1) {
                    values.unshift(list[i]);
                    if (values.length == lastHand.values.length - 1) {
                        values.unshift(list[i - 1]);
                        return new CardHand(values, [], CardUtil.Cards_Type_Straight);
                    }
                } else {
                    values = [];
                }
            }
        } else if (lastHand.type == CardUtil.Cards_Type_Double_Straight) {
            let arr: number[] = [];
            cs.doubleArray.forEach(e => arr = arr.concat(e));
            cs.tripleArray.forEach(e => arr = arr.concat(e.slice(0, 2)));
            if (arr.length < lastHand.values.length) return;
            DeckUtil.sort(arr);
            let values: number[] = [];
            for (let i = arr.length - 1; i >= 3; i -= 2) {
                if (DeckUtil.compareValue(arr[i], lastHand.values[lastHand.values.length - 1]) > 0 && DeckUtil.compareValue(arr[i], arr[i - 2]) == -1) {
                    values.unshift(arr[i]);
                    values.unshift(arr[i - 1]);
                    if (values.length == lastHand.values.length - 2) {
                        values.unshift(arr[i - 2]);
                        values.unshift(arr[i - 3]);
                        return new CardHand(values, [], CardUtil.Cards_Type_Double_Straight);
                    } else {
                        values = [];
                    }
                }
            }
        } else {
            let arr: number[] = [];
            cs.tripleArray.forEach(e => arr = arr.concat(e));
            if (arr.length < lastHand.values.length) return;
            DeckUtil.sort(arr);
            let values: number[] = [];
            for (let i = arr.length - 1; i >= 5; i -= 3) {
                if (DeckUtil.compareValue(arr[i], lastHand.values[lastHand.values.length - 1]) > 0 && DeckUtil.compareValue(arr[i], arr[i - 3]) == -1) {
                    values.unshift(arr[i]);
                    values.unshift(arr[i - 1]);
                    values.unshift(arr[i - 2]);
                    if (values.length == lastHand.values.length - 3) {
                        values.unshift(arr[i - 3]);
                        values.unshift(arr[i - 4]);
                        values.unshift(arr[i - 5]);
                        break;
                    } else {
                        values = [];
                    }
                }
            }
            if (values.length == lastHand.values.length) {
                let valueSet = new Set<number>();
                values.forEach(e => valueSet.add(DeckUtil.value(e)));
                let append: number[] = [];
                if (lastHand.type == CardUtil.Cards_Type_Triple_Straight) {
                    return new CardHand(values, append, lastHand.type);
                } else if (lastHand.type == CardUtil.Cards_Type_Triple_Straight_Append_Single) {
                    for (let i = cs.singleArray.length - 1; i >= 0 ; i --) {
                        if (append.length == values.length / 3) break;
                        append.push(cs.singleArray[i]);
                    }
                    for (let i = cs.doubleArray.length - 1; i >= 0; i --) {
                        if (append.length == values.length / 3) break;
                        append.push(cs.doubleArray[i][0]);
                        if (append.length == values.length / 3) break;
                        append.push(cs.doubleArray[i][1]);
                    }
                    for (let i = cs.tripleArray.length - 1; i >= 0; i --) {
                        if (valueSet.has(cs.tripleArray[i][0])) {
                            continue;
                        }
                        if (append.length == values.length / 3) break;
                        append.push(cs.tripleArray[i][0]);
                        if (append.length == values.length / 3) break;
                        append.push(cs.tripleArray[i][1]);
                        if (append.length == values.length / 3) break;
                        append.push(cs.tripleArray[i][2]);
                    }
                    if (append.length == values.length / 3) {
                        return new CardHand(values, append, lastHand.type);
                    }
                } else if (lastHand.type == CardUtil.Cards_Type_Triple_Straight_Append_Double) {
                    for (let i = cs.doubleArray.length - 1; i >= 0; i --) {
                        if (append.length == values.length / 3 * 2) break;
                        append = append.concat(cs.doubleArray[i]);
                    }
                    for (let i = cs.tripleArray.length - 1; i >= 0; i --) {
                        if (valueSet.has(cs.tripleArray[i][0])) {
                            continue;
                        }
                        if (append.length == values.length / 3 * 2) break;
                        append = append.concat(cs.tripleArray[i].slice(0, 2));
                    }
                    if (append.length == values.length / 3 * 2) {
                        return new CardHand(values, append, lastHand.type);
                    }
                }
            }
        }
    }

    /**
     * 建议炸弹或者王炸
     * @param cards
     */
    static _suggestBombOrJokerBomb(cs: CardSorted, lastHand: CardHand): CardHand {
        if (lastHand.type == CardUtil.Cards_Type_Bomb) {
            for (let i = cs.quadrupleArray.length - 1; i >= 0; i --) {
                if (DeckUtil.compareValue(cs.quadrupleArray[i][0], lastHand.values[0]) > 0) {
                    return new CardHand(cs.quadrupleArray[i], [], CardUtil.Cards_Type_Bomb);
                }
            }
        } else {
            if ( cs.quadrupleArray[cs.quadrupleArray.length - 1] ) {
                return new CardHand(cs.quadrupleArray[cs.quadrupleArray.length - 1], [], CardUtil.Cards_Type_Bomb);
            }
        }
        return this._suggestJokerBomb(cs);
    }

    /**
     * 建议王炸
     * @param cards 
     */
    static _suggestJokerBomb(cs: CardSorted): CardHand {
        let jb = [cs.singleArray[0], cs.singleArray[1]];
        if (CardRuleUtil._isJokerBomb(jb)) {
            return new CardHand(jb, [], CardUtil.Cards_Type_Joker_Bomb);
        }
    }

    
    /**
     * 将牌按照单、对、三张、四张进行分组，大小猫都是单
     * @param cards 
     * @param n 
     */
    static _findValueEqualList(cards: number[]) : CardSorted{
        let cs = new CardSorted();
        let tmp = [].concat(cards);
        while(tmp.length > 0) {
            if (DeckUtil.compareValue(tmp[0], tmp[1]) != 0) {
                cs.singleArray.push(tmp.shift());
            } else if (DeckUtil.compareValue(tmp[0], tmp[2]) != 0) {
                cs.doubleArray.push([tmp.shift(), tmp.shift()]);
            } else if (DeckUtil.compareValue(tmp[0], tmp[3]) != 0) {
                cs.tripleArray.push([tmp.shift(), tmp.shift(), tmp.shift()]);
            } else {
                cs.quadrupleArray.push([tmp.shift(), tmp.shift(), tmp.shift(), tmp.shift()]);
            }
        }
        return cs;
    }
}

class CardSorted {
    singleArray: number[] = [];
    doubleArray: number[][] = [];
    tripleArray: number[][] = [];
    quadrupleArray: number[][] = [];
}