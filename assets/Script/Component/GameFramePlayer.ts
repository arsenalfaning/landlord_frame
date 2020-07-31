// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameLogic from "../Logic/GameLogic";
import WebSocketBean from "../Net/WebSocketBean";
import GameFrame from "../Net/GameFrame";
import ActionBean from "../Bean/ActionBean";

const {ccclass, property} = cc._decorator;

/**
 * 帧播放控制组件
 */

@ccclass
export default class GameFramePlayer extends cc.Component {

    private gameLogic: GameLogic = null;
    private socket: WebSocketBean;
    private frameQueue: GameFrame<Object>[];

    /**
     * 播放速度，每秒多少帧
     */
    @property
    speed: number = 1;
    /**
     * 最近帧发生时服务器时间
     */
    time: number;
    /**
     * 最近帧的服务器发送时间
     */
    serverTime: number;
    /**
     * 服务器时间对应的客户端时间
     */
    clientTime: number;
    /**
     * 最近帧的版本号
     */
    version: number = 0;
    /**
     * 计时器
     */
    delta: number = 0;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.socket = new WebSocketBean(this);
        this.socket.connect();
        this.gameLogic = this.node.getComponent(GameLogic);
        this.frameQueue = [];
    }

    addFrame(frame: GameFrame<Object>) {
        this.frameQueue[frame.v] = frame;
    }

    start () {
        
    }

    update (delta: number) {
        this.delta += delta;
        if (this.delta >= 1 / this.speed) {
            this.delta -= 1 / this.speed;
            this.updateFrame();
        }
    }

    updateFrame() {
        const frame = this.frameQueue[this.version + 1];
        if (frame) {
            this.time = frame.t;
            this.serverTime = frame.st;
            this.clientTime = new Date().getTime();
            this.version ++;
            if (frame.a && frame.a.length > 0) {
                this.gameLogic.updateAction(frame.a).forEach( a => {
                    this.sendAction(a, frame);
                });
            }
        } else {//处理可能的丢帧问题
            //TODO 
        }
    }

    sendAction(action: ActionBean<any>, frame?: GameFrame<any>) {
        if (frame && frame.st - frame.t > 10000) {//落后最新赛况太久，不允许操作
            return;
        }
        this.socket.sendAction(action);
    }

    onDestroy() {
        this.socket.onClose();
    }

    lastFrame() {
        return this.frameQueue[this.version];
    }
}
