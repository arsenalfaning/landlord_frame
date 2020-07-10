// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ActionBean from "../Bean/ActionBean";
import { GameAction } from "../Logic/GameLogic";
import RoomActionBean from "./RoomActionBean";

export default class ActionExecutor {

    actionBean: ActionBean<Object>;

    constructor(actionBean: ActionBean<Object>) {
        this.actionBean = actionBean;
    }

    execute() {
        if (this.actionBean.action == GameAction.Room) {
            let bean = this.actionBean as RoomActionBean;
            
        }
    }
}
