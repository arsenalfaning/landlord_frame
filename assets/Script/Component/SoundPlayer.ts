// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CardHand from "../Util/CardHand";
import CardUtil from "../Util/CardUtil";
import DeckUtil from "../Util/DeckUtil";

const volumn = 1;
const {ccclass, property} = cc._decorator;

@ccclass
export default class SoundPlayer extends cc.Component {

    @property(cc.AudioClip)
    womanSingle: cc.AudioClip[] = [];
    @property(cc.AudioClip)
    womanDouble: cc.AudioClip[] = [];
    @property(cc.AudioClip)
    womanTriple: cc.AudioClip[] = [];
    @property(cc.AudioClip)
    womanTripleAppendSingle: cc.AudioClip = null;
    @property(cc.AudioClip)
    womanTripleAppendDouble: cc.AudioClip = null;
    @property(cc.AudioClip)
    womanQuadrupleAppendTwoSingle: cc.AudioClip = null;
    @property(cc.AudioClip)
    womanQuadrupleAppendTwoDouble: cc.AudioClip = null;
    @property(cc.AudioClip)
    womanStraight: cc.AudioClip = null;
    @property(cc.AudioClip)
    womanDoubleStraight: cc.AudioClip = null;
    @property(cc.AudioClip)
    womanTripleStraight: cc.AudioClip = null;
    @property(cc.AudioClip)
    womanBomb: cc.AudioClip = null;
    @property(cc.AudioClip)
    womanJokerBomb: cc.AudioClip = null;
    @property(cc.AudioClip)
    womanBuyao: cc.AudioClip[] = [];
    @property(cc.AudioClip)
    womanYao: cc.AudioClip[] = [];
    @property(cc.AudioClip)
    womanQiang: cc.AudioClip[] = [];
    @property(cc.AudioClip)
    womanBuQiang: cc.AudioClip[] = [];
    @property(cc.AudioClip)
    musicWin: cc.AudioClip = null;
    @property(cc.AudioClip)
    musicLose: cc.AudioClip = null;
    @property(cc.AudioClip)
    musicCommon: cc.AudioClip = null;

    current: number = -1;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.current = cc.audioEngine.play(this.musicCommon, true, volumn);
    }

    //出牌播放音乐
    playSound(hand: CardHand, first: boolean) {
        switch(hand.type) {
            case CardUtil.Cards_Type_None:
                this.activeRandomAudio(this.womanBuyao)
                break;
            case CardUtil.Cards_Type_Single:
                this.activeAudio(this.womanSingle[DeckUtil.value(hand.values[0])]);
                break;
            case CardUtil.Cards_Type_Double:
                this.activeAudio(this.womanDouble[DeckUtil.value(hand.values[0])]);
                break;
            case CardUtil.Cards_Type_Triple:
                this.activeAudio(this.womanTriple[DeckUtil.value(hand.values[0])]);
                break;
            case CardUtil.Cards_Type_Triple_Append_Single:
                if (first) {
                    this.activeAudio(this.womanTripleAppendSingle);
                } else {
                    this.activeRandomAudio(this.womanYao);
                }
                break;
            case CardUtil.Cards_Type_Triple_Append_Double:
                if (first) {
                    this.activeAudio(this.womanTripleAppendDouble);
                } else {
                    this.activeRandomAudio(this.womanYao);
                }
                break;
            case CardUtil.Cards_Type_Quadruple_Append_Two_Single:
                if (first) {
                    this.activeAudio(this.womanQuadrupleAppendTwoSingle);
                } else {
                    this.activeRandomAudio(this.womanYao);
                }
                break;
            case CardUtil.Cards_Type_Quadruple_Append_Two_Double:
                if (first) {
                    this.activeAudio(this.womanQuadrupleAppendTwoDouble);
                } else {
                    this.activeRandomAudio(this.womanYao);
                }
                break;
            case CardUtil.Cards_Type_Straight:
                if (first) {
                    this.activeAudio(this.womanStraight);
                } else {
                    this.activeRandomAudio(this.womanYao);
                }
                break;
            case CardUtil.Cards_Type_Double_Straight:
                if (first) {
                    this.activeAudio(this.womanDoubleStraight);
                } else {
                    this.activeRandomAudio(this.womanYao);
                }
                break;
            case CardUtil.Cards_Type_Triple_Straight:
            case CardUtil.Cards_Type_Triple_Straight_Append_Single:
            case CardUtil.Cards_Type_Triple_Straight_Append_Double:
                if (first) {
                    this.activeAudio(this.womanTripleStraight);
                } else {
                    this.activeRandomAudio(this.womanYao);
                }
                break;
            case CardUtil.Cards_Type_Bomb:
                this.activeAudio(this.womanBomb);
                break;
            case CardUtil.Cards_Type_Joker_Bomb:
                this.activeAudio(this.womanJokerBomb);
                break;
        }
    }

    /**
     * 结果播放音乐
     * @param win 
     */
    resultSound(win: boolean) {
        if (this.current >= 0) {
            cc.audioEngine.stop(this.current);
            this.current = null;
        }
        if (win) {
            this.activeAudio(this.musicWin);
        } else {
            this.activeAudio(this.musicLose);
        }
    }

    /**
     * 抢地主播放音乐
     * @param approve
     */
    approveSound(approve: boolean, length: number) {
        if (approve) {
            if (length == 0) {
                this.activeAudio(this.womanQiang[0]);
            } else if (length == 1 || length == 2) {
                this.activeAudio(this.womanQiang[1]);
            } else {
                this.activeAudio(this.womanQiang[2]);
            }
        } else {
            this.activeRandomAudio(this.womanBuQiang);
        }
    }

    private activeRandomAudio(audio: cc.AudioClip[]) {
        this.activeAudio(audio[new Date().getTime() % audio.length]);
    }
    private activeAudio(audio: cc.AudioClip) {
        cc.audioEngine.play(audio, false, volumn);
    }
    // update (dt) {}

    onDestroy() {
        if (this.current >= 0) {
            cc.audioEngine.stop(this.current);
        }
    }
}
