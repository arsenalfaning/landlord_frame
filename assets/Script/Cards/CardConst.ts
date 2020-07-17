// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class CardConst extends cc.Component{

    @property({type: cc.SpriteFrame})
    spriteFrames: cc.SpriteFrame[] = [];
    
    @property({type: cc.SpriteFrame})
    landlordFrame: cc.SpriteFrame = null;

    _valueMap : Map<Number, Number> = (() => {
        const map = new Map<Number, Number>();
        map.set(0, 0);
        map.set(0x5E, 53);
        map.set(0x5F, 54);
        var count = 0;
        for (var i = 1; i <= 4; i ++) {
            for (var j = 1; j <= 13; j ++) {
                map.set((i << 4 | j), ++ count);
            }
        }
        return map;
    })();

    getSpriteFrameByValue(value: Number) : cc.SpriteFrame {
        return this.spriteFrames[this._valueMap.get(value) as number];
    }

    onLoad () {
    
    }
}
