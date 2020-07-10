// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CardHand from "../Util/CardHand";
import GamerBean from "./GamerBean";

/**
 * 玩家一次出牌
 */
export default class PlayBean {

    /**
     * 出牌的玩家
     */
    gamer: GamerBean;
    /**
     * 所出的牌，包括要不起
     */
    hand: CardHand;

}
