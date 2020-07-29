// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameBean from "../Bean/GameBean";
import GamerBean from "../Bean/GamerBean";

const GAME:string = "game";
const MYSELF:string = "myself";
const LEFF:string = "left";
const RIGHT:string = "right";
const LANDLORD:string = "landlord";

var game:GameBean;
var myself:GamerBean;
var left:GamerBean;
var right:GamerBean;
var landlord:GamerBean;

export default class VMUtil{

    static init() {
        game = new GameBean();
        myself = new GamerBean();
        left = new GamerBean();
        right = new GamerBean();
        landlord = null;
    }

    static getGameBean(): GameBean {
        return game;
    }

    static getMyself(): GamerBean {
        return myself;
    }

    static getLeft(): GamerBean {
        return left;
    }

    static getRight(): GamerBean {
        return right;
    }

    static getGamers(): GamerBean[] {
        return [this.getMyself(), this.getLeft(), this.getRight()];
    }

    static getCardsByPath(path: string): number[] {
        return VM.getValue(path);
    }

    static getGamerByTag(tag: string): GamerBean {
        if (tag == MYSELF) {
            return myself;
        }
        if (tag == LEFF) {
            return left;
        }
        if (tag == RIGHT) {
            return right;
        }
        if (tag == LANDLORD) {
            return landlord;
        }
        return null;
    }

    static setLandlord(gamer: GamerBean) {
        landlord = gamer;
    }
}
