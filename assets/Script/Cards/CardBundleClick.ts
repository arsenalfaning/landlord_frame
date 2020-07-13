// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CardBundleStatic from "./CardBundleStatic";
import CardClickTemplate from "./CardClickTemplate";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CardBundleClick extends CardBundleStatic {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

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
}
