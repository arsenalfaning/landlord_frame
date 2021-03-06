// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const Value_Array = [0, 14, 20, 3, 4, 5, 6, 7, 8, 9, 10 ,11, 12, 13, 30, 40];
const Texas_Value_Array = [0, 14, 2, 3, 4, 5, 6, 7, 8, 9, 10 ,11, 12, 13, 30, 40];
const Style_Array = [0, 2, 4, 3, 5, 1];

/**
 * 一副牌的相关操作，比如洗牌、排序等
 */
export default class DeckUtil {

    static Card_Black_Joker = 0x5e;
    static Card_Red_Joker = 0x5f;

    /**
     * 获取一副牌
     */
    static getdeck() : number[] {
        const deck = [];
        deck.push(0x5e);
        deck.push(0x5f);
        for (let i = 1; i <= 4; i ++) {
            for (let j = 1; j <= 13; j ++) {
                deck.push((i << 4 | j));
            }
        }
        return deck;
    }

    /**
     * 获取一副牌
     */
    static getdeckWithoutJoker() : number[] {
        const deck = [];
        for (let i = 1; i <= 4; i ++) {
            for (let j = 1; j <= 13; j ++) {
                deck.push((i << 4 | j));
            }
        }
        return deck;
    }
    
    /**
     * 洗牌
     * @param deck 一副牌
     * @param shuffleIndex 随机数组
     */
    static shuffle(deck: number[], shuffleIndex: number[] ) {
        for (let i = 0; i < deck.length; i ++) {
            let j = shuffleIndex[i];
            let v = deck[i];
            deck[i] = deck[j];
            deck[j] = v;
        }
    }

    /**
     * 排序
     * @param deck 牌
     */
    static sort(deck: number[]) {
        deck.sort(this._compare);
    }

    /**
     * texas排序
     * @param deck 
     */
    static texasSort(deck: number[]) {
        deck.sort((card1, card2) => {
            let delta = Texas_Value_Array[DeckUtil.value(card1)] - Texas_Value_Array[DeckUtil.value(card2)];
            if (delta == 0) {
                return - Style_Array[DeckUtil.style(card1)] - Style_Array[DeckUtil.style(card2)];
            } else {
                return - delta;
            }
        })
    }

    /**
     * 比较两张牌的排序顺序
     * @param card1 
     * @param card2 
     */
    static _compare(card1: number, card2: number): number {
        let delta = Value_Array[DeckUtil.value(card1)] - Value_Array[DeckUtil.value(card2)];
        if (delta == 0) {
            return - Style_Array[DeckUtil.style(card1)] - Style_Array[DeckUtil.style(card2)];
        } else {
            return - delta;
        }
    }

    /**
     * 比较两张牌面值大小
     * @param card1 
     * @param card2 
     */
    static compareValue(card1: number, card2: number): number {
        return Value_Array[DeckUtil.value(card1)] - Value_Array[DeckUtil.value(card2)];
    }

    /**
     * Texas比较两张牌面值大小
     * @param card1 
     * @param card2 
     */
    static texasCompareValue(card1: number, card2: number): number {
        return Texas_Value_Array[DeckUtil.value(card1)] - Texas_Value_Array[DeckUtil.value(card2)];
    }

    /**
     * 获取面值
     * @param card
     */
    static value(card: number): number {
        return card & 0x0f;
    }

    /**
     * 获取花色
     * @param card
     */
    static style(card: number): number {
        return (card & 0xf0) >> 4;
    }
}
