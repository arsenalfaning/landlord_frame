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
import TexasGameLogic from "../Logic/TexasGameLogic";

const {ccclass, property} = cc._decorator;

/**
 * 帧播放控制组件
 */

@ccclass
export default class TexasGameFramePlayer extends cc.Component {

    private gameLogic: TexasGameLogic = null;
    private frameQueue: GameFrame<Object>[];

    /**
     * 播放速度，每秒多少帧
     */
    @property
    speed: number = 30;
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

    init() {
        this.time = null;
        this.serverTime = null;
        this.clientTime = null;
        this.version = 0;
        this.delta = 0;
        this.frameQueue = [];
    }

    onLoad () {
        this.gameLogic = this.node.getComponent(TexasGameLogic);
        this.init();
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
                this.gameLogic.updateAction(frame.a);
            }
        } else {//处理可能的丢帧问题
            //TODO 
        }
    }

    lastFrame() {
        return this.frameQueue[this.version];
    }
}
