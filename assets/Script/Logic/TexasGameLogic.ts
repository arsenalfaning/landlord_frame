// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TexasGameBean from "../Bean/TexasGameBean";
import VMUtil from "../Util/VMUtil";
import ActionBean from "../Bean/ActionBean";
import { GameAction } from "./GameLogic";
import TexasRoomBean from "../Bean/TexasRoomBean";
import TexasGamerLogic from "./TexasGamerLogic";

export enum GameState {
    PreFlop = 1,//翻牌前
    FlopRound = 3,//翻牌圈
    TurnRound = 5,//转牌圈
    RiverRound = 7,//河牌圈
    GameOver = 10,//比较大小
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class TexasGameLogic extends cc.Component {

    @property(cc.Node)
    gamerNode: cc.Node[] = [];

    _game: TexasGameBean = null;

    _socket: WebSocket = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._game = new TexasGameBean();
        this._connect();
        this.gamerNode.forEach(n => n.active = false);
    }

    start () {

    }

    // update (dt) {}

    _connect() {
        this._socket = new WebSocket(VMUtil.getStartGameBean().uri + "?token=" + VMUtil.getMyself().gamerId + "&room=" + VMUtil.getStartGameBean().roomId);//标准的websocket对象
        this._socket.onmessage = this._onMessage.bind(this);
        this._socket.onerror = this._onError.bind(this);
        this._socket.onopen = this._onOpen.bind(this);
    }

    _onOpen() {
        
    }

    _onMessage(event: MessageEvent) {
        try {
            let aciton = JSON.parse(event.data) as ActionBean<any>;
            if (aciton) {
                if (aciton.action == GameAction.TexasRoom) {
                    let room = aciton as ActionBean<TexasRoomBean>;
                    const gamers = room.data.gamers;
                    const myselfId = VMUtil.getMyself().gamerId;
                    let index = -1;
                    for (let i = 0; i < gamers.length; i ++) {
                        if (gamers[i].gamerId == myselfId) {
                            index = i;
                            break;
                        }
                    }
                    const gamersInOrder = gamers.slice(index).concat(gamers.slice(0, index));
                    for (let i = 0; i < gamersInOrder.length; i ++) {
                        let logic = this.gamerNode[i].getComponent(TexasGamerLogic);
                        logic.gamerInit(gamersInOrder[i]);

                    }
                } else if (aciton.action == GameAction.TexasDeal) {
                    
                }
            }
        } catch(e) {
            console.error(e);
        }
    }

    _onError(event: Event) {
        console.error(event);
    }

    _send(action: ActionBean<any>) {
        this._socket.send(JSON.stringify(action));
    }

    onDestroy() {
        if (this._socket) {
            this._socket.close();
        }
    }
}
