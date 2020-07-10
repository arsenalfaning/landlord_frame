// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

export default class OrderUtil {

    static isLeft(myOrder: number, otherOrder: number): boolean{
        return myOrder - otherOrder == 1 || myOrder - otherOrder == -2;
    }

    static isRight(myOrder: number, otherOrder: number): boolean{
        return myOrder - otherOrder == -1 || myOrder - otherOrder == 2;
    }

    static nextOrder(currentOrder: number): number {
        currentOrder ++;
        if (currentOrder > 2) {
            currentOrder = 0;
        }
        return currentOrder;
    }
}
