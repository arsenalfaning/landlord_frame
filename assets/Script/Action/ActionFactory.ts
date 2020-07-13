// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ActionBean from "../Bean/ActionBean";
import { GameAction } from "../Logic/GameLogic";
import VMUtil from "../Util/VMUtil";

/**
 * Action构建工厂类
 */
export default class ActionFactory {

    static build<T>(action: GameAction, data?: T) : ActionBean<T> {
        const ab = new ActionBean<T>();
        ab.order = VMUtil.getMyself().order;
        if (data) {
            ab.data = data;
        }
        ab.action = action;
        return ab;
    }
}
