// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameBean from "../Bean/GameBean";
import { VM } from "../ViewModel/ViewModel";
import GamerBean from "../Bean/GamerBean";

const GAME:string = "game";
const MYSELF:string = "myself";
const LEFF:string = "left";
const RIGHT:string = "right";

export default class VMUtil{

    static init() {
        VM.remove(GAME);
        VM.remove(MYSELF);
        VM.remove(LEFF);
        VM.remove(RIGHT);
        VM.add(new GameBean(), GAME);
        VM.add(new GamerBean(), MYSELF);
        VM.add(new GamerBean(), LEFF);
        VM.add(new GamerBean(), RIGHT);
    }

    static getGameBean(): GameBean {
        return VM.get<GameBean>(GAME).$data;
    }

    static getMyself(): GamerBean {
        return VM.get<GamerBean>(MYSELF).$data;
    }

    static getLeft(): GamerBean {
        return VM.get<GamerBean>(LEFF).$data;
    }

    static getRight(): GamerBean {
        return VM.get<GamerBean>(RIGHT).$data;
    }

    static updateGamers() {
        VM.setValue(MYSELF + ".state", this.getMyself().state);
        VM.setValue(LEFF + ".state", this.getLeft().state);
        VM.setValue(RIGHT + ".state", this.getRight().state);
    }

    static getGamers(): GamerBean[] {
        return [this.getMyself(), this.getLeft(), this.getRight()];
    }

    static getCardsByPath(path: string): number[] {
        return VM.getValue(path);
    }

}
