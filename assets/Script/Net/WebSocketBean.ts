// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameFramePlayer from "../Component/GameFramePlayer";
import ActionBean from "../Bean/ActionBean";
import VMUtil from "../Util/VMUtil";

const host = "ws://192.168.0.102:8080/common?token=";

export default class WebSocketBean {

    private sock: WebSocket;
    private player: GameFramePlayer;
    
    constructor(player: GameFramePlayer) {
        this.player = player;
    }

    onOpen() {

    }

    onMessage(event: MessageEvent) {
        try {
            var frame = JSON.parse(event.data);
            this.player.addFrame(frame);
            //console.log(frame);
        } catch (e) {
            console.log(e);
        }
    }

    onClose() {
        this.sock.close();
    }

    onError(event: Event) {
        console.log(event);
    }

    connect() {
        this.sock = new WebSocket(host + VMUtil.getMyself().gamerId);//标准的websocket对象
        this.sock.onopen = this.onOpen.bind(this);
        this.sock.onmessage = this.onMessage.bind(this);
        this.sock.onclose = this.onClose.bind(this);
        this.sock.onerror = this.onError.bind(this);
    }

    sendAction(action: ActionBean<any>) {
        if (this.sock) {
            this.sock.send(JSON.stringify(action));
        } else {
            console.log(this);
        }
    }
}
