// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CardBundleStatic from "./CardBundleStatic";
import CardTemplate from "./CardTemplate";
import VMUtil from "../Util/VMUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CardBundleHidden extends CardBundleStatic {

    private cards: number[] = [];

    setData(cards: number[]) {
        if (cards) {
            if (this.testEqual(cards)) return;
            this.node.removeAllChildren();
            this.cards = cards;
            if (cards.length > 0) {
                this._cardTemplates = [];
                this.cardTemplateMap.clear();
                for (var i = 0; i < cards.length; i ++) {
                    var value = 0;
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

    setShow() {
        super.setData(this.cards);
    }

    // update (dt) {}
}
