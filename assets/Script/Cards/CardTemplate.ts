// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CardConst from "./CardConst";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CardTemplate extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    @property(cc.Prefab)
    cardConstPrefab: cc.Prefab = null;
    _value: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    start () {

    }

    setValue(value: number) {
        this._value = value;
        this.sprite.spriteFrame = this.cardConstPrefab.data.getComponent(CardConst).getSpriteFrameByValue(this._value);
    }

    // update (dt) {}
}
