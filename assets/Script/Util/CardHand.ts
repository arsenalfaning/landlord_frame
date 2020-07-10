// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CardUtil from "./CardUtil";
import DeckUtil from "./DeckUtil";

/**
 * 一手牌
 */
export default class CardHand {

    /**
     * 牌数组
     */
    cards: number[] = [];
    /**
     * 生效的牌数组，三带一里的三
     */
    values: number[] = [];
    /**
     * 附带的牌数组，三带一里的一
     */
    append: number[] = [];
    /**
     * 牌的类型
     * @see CardUtil
     */
    type: number = 0;

    constructor(values: number[], append: number[], type: number) {
        this.cards = values.concat(append);
        this.values = values;
        this.append = append;
        this.type = type;
    }

    /**
     * 与另外一手牌比较大小
     * @param another 
     */
    compareTo(another: CardHand) : number {
        if (this.type == CardUtil.Cards_Type_Joker_Bomb) {//王炸最大
            return 1;
        }
        if (another.type == CardUtil.Cards_Type_Joker_Bomb) {//王炸最大
            return -1;
        }
        if (this.type == CardUtil.Cards_Type_Bomb && another.type != CardUtil.Cards_Type_Bomb) {//炸弹大过一般牌
            return 1;
        }
        if (another.type == CardUtil.Cards_Type_Bomb && this.type != CardUtil.Cards_Type_Bomb) {//炸弹大过一般牌
            return -1;
        }
        if (this.type == another.type) {//类型相同，比较首张牌面值（已排序保证首张牌最大）
            return DeckUtil.compareValue(this.values[0], another.values[0]);
        }
        return null;//类型不同，无法比较，返回null
    }
}
