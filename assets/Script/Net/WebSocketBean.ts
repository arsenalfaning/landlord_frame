// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { VM } from "../ViewModel/ViewModel";

const host = "ws://192.168.0.104:8080/hello?token=";

export default class WebSocketBean {

    private sock: WebSocket;
    
    onOpen() {

    }

    onMessage(event: MessageEvent) {
        try {
            var data = JSON.parse(event.data);
            console.log(data);
        } catch (e) {
            console.log(e);
        }
    }

    onClose() {
        this.sock.close();
    }

    onError(event: Event) {
        
    }

    connect() {
        this.sock = new WebSocket(host + VM.getValue("game.myself.gamerId"));//标准的websocket对象
        this.sock.onopen = this.onOpen.bind(this);
        this.sock.onmessage = this.onMessage.bind(this);
        this.sock.onclose = this.onClose.bind(this);
        this.sock.onerror = this.onError.bind(this);
    }
}
