// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


export default class EventUtil {

    static Game_State = "game-state-change";
    static Game_Turn = "game-turn-change";
    static Game_Round = "game-round-change";
    static Game_Time = "game-time-change";
    static Game_HoleCards = "game-hole-cards-change";

    static Gamer_State = "gamer-state-change";
    static Gamer_Landlord = "gamer-landlord-change";
    static Gamer_Cards = "gamer-cards-change";
    static Gamer_Id = "gamer-id-change";
    static Gamer_Point = "gamer-point-change";
    static Gamer_Hand = "gamer-hand-change";
    static Gamer_Approve = "gamer-approve-change";
}
