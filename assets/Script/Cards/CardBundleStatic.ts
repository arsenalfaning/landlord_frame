// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CardTemplate from "./CardTemplate";
import VMUtil from "../Util/VMUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CardBundleStatic extends cc.Component {

    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    _cardTemplates: CardTemplate[] = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    setData(event: any, path: string) {
        if (path) {
            this.node.removeAllChildren();
            const cards = VMUtil.getCardsByPath(path);
            if (cards && cards.length > 0) {
                this._cardTemplates = [];
                for (var i = 0; i < cards.length; i ++) {
                    var value = cards[i];
                    var node = cc.instantiate(this.cardPrefab);
                    var ct = node.getComponent(CardTemplate);
                    ct.setValue(value);
                    this.node.addChild(node);
                    this._cardTemplates.push(ct);
                }
            }
        }
    }

    start () {

    }

    // update (dt) {}
}
