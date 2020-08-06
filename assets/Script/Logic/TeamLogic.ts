// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeamBean from "../Team/TeamBean";
import VMUtil from "../Util/VMUtil";
import ActionBean from "../Bean/ActionBean";
import TeamJoinBean from "../Bean/TeamJoinBean";
import ActionFactory from "../Action/ActionFactory";
import { GameAction } from "./GameLogic";

const {ccclass, property} = cc._decorator;

const host = "ws://192.168.0.103:8080/team?token=";

@ccclass
export default class TeamLogic extends cc.Component {

    @property(cc.Node)
    teamNode: cc.Node = null;

    @property(cc.Node)
    buttonNode: cc.Node = null;

    _socket: WebSocket = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._connect();
    }

    start () {

    }

    // update (dt) {}

    onDestroy() {
        if (this._socket) {
            this._socket.close();
        }
    }

    _build(team: TeamBean) {
        this.teamNode.removeAllChildren();
        team.gamerIdSet.forEach(name => {
            let node = new cc.Node();
            node.addComponent(cc.Label);
            let label = node.getComponent(cc.Label);
            label.fontSize = 28;
            label.lineHeight = 28;
            label.string = name + (name == team.leaderId ? "（队长）" : "");
            this.teamNode.addChild(node);
        });
        this.buttonNode.active = team.leaderId == VMUtil.getMyself().gamerId;
    }

    _connect() {
        this._socket = new WebSocket(host + VMUtil.getMyself().gamerId);//标准的websocket对象
        this._socket.onmessage = this._onMessage.bind(this);
        this._socket.onerror = this._onError.bind(this);
        this._socket.onopen = this._onOpen.bind(this);
    }

    _onOpen() {
        let invitor = VMUtil.getTeamInvitor();
        if (invitor) {//加入
            let b = new TeamJoinBean();
            b.invitor = invitor;
            this._send(ActionFactory.build(GameAction.TeamJoin, b));
        } else {//创建

            this._send(ActionFactory.build(GameAction.TeamCreate, ));
        }
    }

    _onMessage(event: MessageEvent) {
        try {
            let team = JSON.parse(event.data) as TeamBean;
            if (team) {
                this._build(team);
            }
            console.log(team);
        } catch(e) {
            console.error(e);
        }
    }

    _onError(event: Event) {
        console.error(event);
    }

    _send(action: ActionBean<TeamJoinBean>) {
        this._socket.send(JSON.stringify(action));
    }
}
