// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameBean from "../Bean/GameBean";
import VMUtil from "../Util/VMUtil";
import GameFramePlayer from "./GameFramePlayer";

const {ccclass} = cc._decorator;

@ccclass
export default class GameSchedule extends cc.Component {

    game: GameBean = null;

    deltaTime: number = 0;

    actionTime: number = 0;

    task: Function = null;

    timeout: number = 0;

    executed: boolean = true; //是否已执行完毕

    delta: number = 0;

    player: GameFramePlayer = null;

    // LIFE-CYCLE CALLBACKS:
    
    onLoad () {
        this.game = VMUtil.getGameBean();
        this.player = this.node.getComponent(GameFramePlayer);
    }

    start () {

    }

    update(delta: number) {
        this.delta += delta;
        if (this.delta > 0.5) {
            this.delta -= 0.5;
            if (!this.executed) {
                const d = this.deltaTime + new Date().getTime() - this.actionTime;
                if (d >= this.timeout) {//满足执行条件
                    this.game.time = 0;
                    this.task();
                    this.executed = true;
                } else {
                    this.game.time = parseInt(((this.timeout - d) / 1000).toFixed(0));
                }
            }
        }
    }

    private addTask(actionTime: number, serverTime: number, clientTime: number, timeout: number, task: Function) {
        this.deltaTime = serverTime - clientTime;
        this.actionTime = actionTime;
        this.timeout = timeout;
        this.task = task;
        this.executed = false;
        this.game.time = parseInt(((this.timeout) / 1000).toFixed(0));
    }

    changeOrder(newTurn: number, oldTurn: number) {
        const turn = newTurn;
        this.addTask(this.player.time, this.player.serverTime, this.player.clientTime, 20000, () => {
            const action = this.game.botAction(turn);
            // if (action) {
            //     this.player.sendAction(action);
            // }
        });
    }
}
