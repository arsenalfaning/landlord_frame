// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CardTemplate from "./CardTemplate";
import GamerBean from "../Bean/GamerBean";
import VMUtil from "../Util/VMUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CardBundleStatic extends cc.Component {

    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;
    @property(cc.String)
    landlordTag: string = '';
    _cardTemplates: CardTemplate[] = [];

    cardTemplateMap: Map<number, CardTemplate> = new Map();

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    setData(cards: number[]) {
        if (cards) {
            if (this.testEqual(cards)) return;
            this.node.removeAllChildren();
            if (cards.length > 0) {
                this._cardTemplates = [];
                this.cardTemplateMap.clear();
                for (var i = 0; i < cards.length; i ++) {
                    var value = cards[i];
                    var node = cc.instantiate(this.cardPrefab);
                    var ct = node.getComponent(CardTemplate);
                    const gamer = VMUtil.getGamerByTag(this.landlordTag);
                    ct.setValue(value, gamer ? gamer.landlord == 1 : false);
                    this.node.addChild(node);
                    this._cardTemplates.push(ct);
                    this.cardTemplateMap.set(value, ct);
                }
            }
        }
    }

    testEqual(cards: number[]) {
        let equal = true;
        if (cards.length == this._cardTemplates.length) {
            for (let i = 0; i < cards.length; i ++) {
                if (this._cardTemplates[i] && this._cardTemplates[i].value == cards[i]) {
                    continue;
                } else {
                    equal = false;
                    break;
                }
            }
        } else {
            equal = false;
        }
        return equal;
    }

    start () {

    }

    // update (dt) {}
}
