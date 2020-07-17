// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CardBundleStatic from "./CardBundleStatic";
import CardClickTemplate from "./CardClickTemplate";
import CardTemplate from "./CardTemplate";
import VMUtil from "../Util/VMUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CardBundleClick extends CardBundleStatic {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    setData(cards: number[]) {
        if (cards) {
            this.node.removeAllChildren();
            if (cards.length > 0) {
                this._cardTemplates = [];
                this.cardTemplateMap.clear();
                for (var i = 0; i < cards.length; i ++) {
                    var value = cards[i];
                    var node = cc.instantiate(this.cardPrefab);
                    var ct = node.getComponent(CardTemplate);
                    ct.setValue(value, VMUtil.getMyself().landlord == 1);
                    this.node.addChild(node);
                    this._cardTemplates.push(ct);
                    this.cardTemplateMap.set(value, ct);
                }
            }
        }
    }

    setSelected(cards: number[]) {
        this._cardTemplates.forEach( ct => {
            const cct = ct as CardClickTemplate;
            if (cct.selected) {
                cct.onTouch();
            }
        });
        cards.forEach( value => {
            const cct = this.cardTemplateMap.get(value) as CardClickTemplate;
            cct.onTouch();
        })

    }

    getSelcted(): number[] {
        const cards = this._cardTemplates.filter(ct => (ct as CardClickTemplate).selected).map(ct => ct._value);
        return cards;
    }
}
