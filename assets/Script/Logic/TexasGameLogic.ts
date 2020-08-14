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
import TexasButtonLogic from "./TexasButtonLogic";
import TexasBetBean from "../Bean/TexasBetBean";
import TexasBetActionBean from "../Action/TexasBetActionBean";
import TexasPublicCardsLogic from "./TexasPublicCardsLogic";
import TexasGamerResultLogic from "./TexasGamerResultLogic";
import ResultBean from "../Bean/ResultBean";
import ActionFactory from "../Action/ActionFactory";
import BetUtil from "../Util/BetUtil";

export enum GameState {
    PreFlop = 1,//翻牌前
    FlopRound = 3,//翻牌圈
    TurnRound = 5,//转牌圈
    RiverRound = 7,//河牌圈
    GameOver = 10,//比较大小
}

const {ccclass, property} = cc._decorator;

class TexasSettleBean {
    gamerResult: ResultBean[];
    seed: number;
}

@ccclass
export default class TexasGameLogic extends cc.Component {

    @property(cc.Node)
    gamerNode: cc.Node[] = [];
    @property(cc.Node)
    resultNode: cc.Node = null;

    @property(cc.Label)
    potLabel: cc.Label = null;
    @property(cc.Button)
    continueButton: cc.Button = null;

    _game: TexasGameBean = null;

    _socket: WebSocket = null;

    _framePlayer: TexasGameFramePlayer = null;

    _captainId: string = null;

    @property(TexasButtonLogic)
    texasButtonLogic: TexasButtonLogic = null;
    @property(TexasPublicCardsLogic)
    publicCardsLogic: TexasPublicCardsLogic = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._connect();
        this.gamerNode.forEach(n => n.active = false);
        this._framePlayer = this.node.getComponent(TexasGameFramePlayer);
        this.resultNode.active = false;
        this._game = new TexasGameBean();
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
            if (frame.a && frame.a[0].action == GameAction.TexasRoom) {
                this._framePlayer.init();
            }
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
                    this.resultNode.active = false;
                    let room = aciton as ActionBean<TexasRoomBean>;
                    this._updateRoomInfoAndDeck(room);
                    this._deal();
                    this._updateUI();
                } else if (aciton.action == GameAction.TexasBet || aciton.action == GameAction.TexasRaise || aciton.action == GameAction.TexasCall || 
                    aciton.action == GameAction.TexasCheck || aciton.action == GameAction.TexasFold || aciton.action == GameAction.TexasAllIn) {
                    let bet = aciton as TexasBetActionBean;
                    let result = TexasUtil.doBet(this._game, this._game.gamers.filter(e => e.gamerId == bet.data.gamerId)[0], bet.data.amount);
                    if (result) {
                        const flag = TexasUtil.changeActiveGamer(this._game, aciton.action);
                        if (!flag) {
                            this._nextRound();
                        }
                        this._updateUI();
                    }
                }
            });
        }
    }

    _updateRoomInfoAndDeck(room: ActionBean<TexasRoomBean>) {
        this._game.seed = room.data.seed;
        this._game.pot = 0;
        this._game.lastSidePot = 0;
        this._game.betMap.clear();
        this._game.publicCards = [];
        this._game.maxBetted = 0;
        this._game.bettingIndex = -1;
        this._game.buttonIndex = room.data.buttonIndex;
        this._captainId = room.data.captain;
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
            logic.gamerInit(gamersInOrder[i], this._game);
        }
        this._game.gamers = gamers;
        this._decideButtonAndBlind();
        this._game.deck = DeckUtil.getdeckWithoutJoker();
        this._game.state = GameState.PreFlop;
        DeckUtil.shuffle(this._game.deck, room.data.cards);
        this.publicCardsLogic.addCards(this._game.publicCards);
        BetUtil.init();
    }

    /**
     * 确定庄位、大盲位、小盲位
     */
    _decideButtonAndBlind() {
        this._game.bigBlindIndex = this._game.buttonIndex + 2;
        this._game.smallBlindIndex = this._game.buttonIndex + 1;
        if (this._game.bigBlindIndex >= this._game.gamers.length) this._game.bigBlindIndex = 0;
        if (this._game.smallBlindIndex >= this._game.gamers.length) this._game.smallBlindIndex = 0;
    }

    /**
     * 发牌，从小盲位顺时针（index从小到大）发牌
     */
    _deal() {
        const gamersInOrder = this._game.gamers.slice(this._game.smallBlindIndex).concat(this._game.gamers.slice(0, this._game.smallBlindIndex));
        gamersInOrder.forEach( g => {
            g.state = GamerState.waiting;
            g.cards = [this._game.deck.shift()];
        });
        gamersInOrder.forEach( g => {
            g.cards.push(this._game.deck.shift());
        });
        TexasUtil.setGamerStatus(this._game);
        TexasUtil.doBet(this._game, this._game.gamers[this._game.smallBlindIndex], this._game.miniBet);
        TexasUtil.doBet(this._game, this._game.gamers[this._game.bigBlindIndex], this._game.miniBet * 2);
        this._game.gamers.forEach( g => {
            g.logic.updateUI();
        });
    }

    /**
     * 开启下一轮
     */
    _nextRound() {
        if (this._game.state == GameState.PreFlop) {//进行翻牌
            this._game.state = GameState.FlopRound;
            this._game.maxBetted = 0;
            this._game.deck.shift();
            this._game.publicCards.push(this._game.deck.shift());
            this._game.publicCards.push(this._game.deck.shift());
            this._game.publicCards.push(this._game.deck.shift());
            this.publicCardsLogic.addCards(this._game.publicCards);
        } else if (this._game.state == GameState.FlopRound) {//进行转牌
            this._game.state = GameState.TurnRound;
            this._game.maxBetted = 0;
            this._game.deck.shift();
            this._game.publicCards.push(this._game.deck.shift());
            this.publicCardsLogic.addCards(this._game.publicCards);
        } else if (this._game.state == GameState.TurnRound) {//进行河牌
            this._game.state = GameState.RiverRound;
            this._game.maxBetted = 0;
            this._game.deck.shift();
            this._game.publicCards.push(this._game.deck.shift());
            this.publicCardsLogic.addCards(this._game.publicCards);
        } else if (this._game.state == GameState.RiverRound) {//进行结算
            this._game.state = GameState.GameOver;
            TexasUtil.calculateResult(this._game);
            this.resultNode.active = true;
            this.continueButton.node.active = false;
            let logics = this.node.getComponentsInChildren(TexasGamerResultLogic);
            for (let i = 0; i < logics.length; i ++) {
                logics[i].setData(this._game.gamers[i]);
            }
            //把结果发送给服务器
            const rbArray: ResultBean[] = [];
            this._game.gamers.forEach(g => {
                let rb = new ResultBean();
                rb.gamerId = g.gamerId;
                rb.point = g.result.deltaPoint;
                rbArray.push(rb);
            });
            let settleBean = new TexasSettleBean();
            settleBean.gamerResult = rbArray;
            settleBean.seed = this._game.seed;
            this._send(ActionFactory.build(GameAction.TexasSettle, settleBean));
            this.scheduleOnce(()=>{
                this.continueButton.node.active = this._game.gamers[this._game.myselfIndex].gamerId == this._captainId;
            }, 2);
            this._game.gamers.forEach(g => {
                g.logic.updateUI();
            });
            return;
        }
        this._game.gamers.forEach(g => {
            if (g.state != GamerState.allIn && g.state != GamerState.fold) {
                g.state = GamerState.waiting;
            }
        })
        const bettingIndex = TexasUtil.findFirstValidIndex(this._game);
        if (bettingIndex >= 0) {
            this._game.bettingIndex = bettingIndex;
            this._game.gamers[bettingIndex].state = GamerState.betting;
        } else {
            this._nextRound();
        }
        this._game.gamers.forEach(g => {
            g.betPoint = 0;
            g.logic.updateUI();
        });
    }

    _updateUI() {
        //console.log(this._game);
        this.potLabel.string = "$" + this._game.pot.toString();
        this.texasButtonLogic.updateUI(this._game);
    }

    sendBetAction(e: Event, amount: number) {
        this._sendBetAction(amount, this._game.maxBetted ? GameAction.TexasRaise: GameAction.TexasBet);
    }

    sendCallAction(e: Event) {
        const myself = this._game.gamers[this._game.myselfIndex];
        this._sendBetAction(this._game.maxBetted - (myself.betPoint ? myself.betPoint : 0), GameAction.TexasCall);
    }

    sendCheckAction() {
        this._sendBetAction(0, GameAction.TexasCheck);
    }

    sendFoldAction() {
        this._sendBetAction(0, GameAction.TexasFold);
    }

    sendContinueAction() {
        this._send(ActionFactory.build(GameAction.TexasContinue));
    }

    sendAllInAction() {
        this._sendBetAction(this._game.gamers[this._game.myselfIndex].point, GameAction.TexasAllIn);
    }

    _sendBetAction(amount: number, gameAction: GameAction) {
        const myself = this._game.gamers[this._game.myselfIndex];
        if (myself.state == GamerState.betting) {
            const bean = new TexasBetBean();
            bean.amount = amount;
            bean.gamerId = myself.gamerId;
            const action = new TexasBetActionBean();
            action.data = bean;
            action.action = gameAction;
            this._send(action);
        }
    }
}
