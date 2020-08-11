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
import TexasGamerLogic, { GamerState } from "./TexasGamerLogic";
import GameFrame from "../Net/GameFrame";
import TexasGameFramePlayer from "../Component/TexasGameFramePlayer ";
import DeckUtil from "../Util/DeckUtil";
import TexasUtil from "../Util/TexasUtil";

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

    @property(cc.Label)
    potLabel: cc.Label = null;

    _game: TexasGameBean = null;

    _socket: WebSocket = null;

    _framePlayer: TexasGameFramePlayer = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._connect();
        this.gamerNode.forEach(n => n.active = false);
        this._framePlayer = this.node.getComponent(TexasGameFramePlayer);
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
            let frame = JSON.parse(event.data) as GameFrame<any>;
            this._framePlayer.addFrame(frame);
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

    updateAction(actions: ActionBean<any>[]) {
        if (actions) {
            actions.forEach(aciton => {
                if (aciton.action == GameAction.TexasRoom) {
                    let room = aciton as ActionBean<TexasRoomBean>;
                    this._updateRoomInfoAndDeck(room);
                    this._deal();
                    this._updateUI();
                } else if (aciton.action == GameAction.TexasDeal) {
                    
                }
            });
        }
    }

    _updateRoomInfoAndDeck(room: ActionBean<TexasRoomBean>) {
        this._game = new TexasGameBean();
        const gamers = room.data.gamers;
        const myselfId = VMUtil.getMyself().gamerId;
        let index = -1;
        for (let i = 0; i < gamers.length; i ++) {
            if (gamers[i].gamerId == myselfId) {
                index = i;
                break;
            }
        }
        this._game.myselfIndex = index;
        const gamersInOrder = gamers.slice(index).concat(gamers.slice(0, index));
        for (let i = 0; i < gamersInOrder.length; i ++) {
            this.gamerNode[i].active = true;
            let logic = this.gamerNode[i].getComponent(TexasGamerLogic);
            logic.gamerInit(gamersInOrder[i]);
        }
        this._game.gamers = gamers;
        this._game.deck = DeckUtil.getdeckWithoutJoker();
        this._game.state = GameState.PreFlop;
        DeckUtil.shuffle(this._game.deck, room.data.cards);
    }

    /**
     * 发牌，从小盲位顺时针（index从小到大）发牌
     */
    _deal() {
        const gamersInOrder = this._game.gamers.slice(this._game.smallBlindIndex).concat(this._game.gamers.slice(0, this._game.smallBlindIndex));
        gamersInOrder.forEach( g => {
            g.state = GamerState.waiting;
            g.cards = [this._game.deck.shift(), this._game.deck.shift()];
        });
        TexasUtil.setGamerStatus(this._game);
        TexasUtil.doBet(this._game, this._game.gamers[this._game.smallBlindIndex], this._game.miniBet);
        TexasUtil.doBet(this._game, this._game.gamers[this._game.bigBlindIndex], this._game.miniBet * 2);
        gamersInOrder.forEach( g => {
            g.logic.updateUI();
        });
    }

    _updateUI() {
        this.potLabel.string = "$" + this._game.pot.toString();
    }
}
