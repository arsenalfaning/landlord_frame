// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TexasPublicCardsLogic from "./TexasPublicCardsLogic";
import TexasGamer from "../Bean/TexasGamer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TexasGamerResultLogic extends cc.Component {


    @property(TexasPublicCardsLogic)
    texasCardsLogic: TexasPublicCardsLogic = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    deltaLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    setData(gamer: TexasGamer) {
        if (gamer) {
            this.nameLabel.string = gamer.gamerId;
            this.texasCardsLogic.addCards(gamer.result.texasCards.cards);
            this.deltaLabel.string = ( gamer.result.deltaPoint > 0 ? "+" : "-" ) + "$" + Math.abs(gamer.result.deltaPoint);
        } else {
            this.nameLabel.string = "";
            this.deltaLabel.string = "";
            this.texasCardsLogic.addCards([]);
        }
    }
}
