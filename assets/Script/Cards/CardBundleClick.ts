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

    _lastTouchNode: cc.Node = null;
    _touchStartIndex: number = -1;

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        
    }

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, this._touch_start, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._touch_move, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._touch_end, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touch_cancel, this);
    }

    // update (dt) {}

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
        const cards = this._cardTemplates.filter(ct => (ct as CardClickTemplate).selected).map(ct => ct.value);
        return cards;
    }

    private _touch_start(event: cc.Touch): void {
        this._touchStartIndex = this._select_touch_card(this.node.convertToNodeSpaceAR(event.getLocation()));
    }

    private _touch_move(event: cc.Touch): void {
        let i = this._select_touch_card(this.node.convertToNodeSpaceAR(event.getLocation()));
        if (i > 0 && this._lastTouchNode && this._touchStartIndex >= 0) {
            const ctl0 = this._cardTemplates[this._touchStartIndex] as CardClickTemplate;
            for (let j = Math.min(this._touchStartIndex, i)  + 1; j < Math.max(this._touchStartIndex, i); j ++) {
                let ctl = this._cardTemplates[j] as CardClickTemplate;
                if (ctl.selected != ctl0.selected) {
                    ctl.onTouch();
                }
            }
        }
    }

    private _touch_end(event: cc.Touch): void {
        this._lastTouchNode = null;
        this._touchStartIndex = -1;
    }

    private _touch_cancel(event: cc.Touch): void {
        this._lastTouchNode = null;
        this._touchStartIndex = -1;
    }

    private _select_touch_card(position: cc.Vec2): number {
        for (let i = 0; i < this.node.children.length; i ++) {
            let node = this.node.children[i];
            if (node != this._lastTouchNode && node.x - node.width*node.anchorX <= position.x && 
                node.x + node.width*node.anchorX - (i == this.node.children.length - 1 ? 0 : 74) >= position.x &&
                node.y - node.height*node.anchorY <= position.y && node.y + node.height*node.anchorY >= position.y) {
                    let ctl = node.getComponent(CardClickTemplate);
                    this._lastTouchNode = node;
                    ctl.onTouch();
                    return i;
                }
        }
        return -1;
    }
}
