// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CardTemplate from "../Cards/CardTemplate";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TexasPublicCardsLogic extends cc.Component {

    @property(cc.Prefab)
    prefab: cc.Prefab = null;

    _cards: number[] = [];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    addCards(cards: number[]) {
        this._cards = this._cards.concat(cards);
        if (cards.length > 0) {
            for (var i = 0; i < cards.length; i ++) {
                var value = cards[i];
                var node = cc.instantiate(this.prefab);
                var ct = node.getComponent(CardTemplate);
                ct.setValue(value, false);
                this.node.addChild(node);
            }
        }
    }

    clearCards() {
        this._cards = [];
        this.node.removeAllChildren();
    }

    start () {
        
    }

    // update (dt) {}
}
