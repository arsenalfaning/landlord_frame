// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

export default class CardUtil  {

    /**
     * 要不起
     */
    static Cards_Type_None: number = 0;
    /**
     * 单
     */
    static Cards_Type_Single: number = 10;
    /**
     * 对
     */
    static Cards_Type_Double: number = 20;
    /**
     * 三张
     */
    static Cards_Type_Triple: number = 30;
    /**
     * 三带一
     */
    static Cards_Type_Triple_Append_Single: number = 31;
    /**
     * 三带一对
     */
    static Cards_Type_Triple_Append_Double: number = 32;
    /**
     * 四带二
     */
    static Cards_Type_Quadruple_Append_Two_Single: number = 41;
    /**
     * 四带两对
     */
    static Cards_Type_Quadruple_Append_Two_Double: number = 42;
    /**
     * 顺子
     */
    static Cards_Type_Straight: number = 50;
    /**
     * 连对
     */
    static Cards_Type_Double_Straight: number = 60;
    /**
     * 飞机
     */
    static Cards_Type_Triple_Straight: number = 70;
    /**
     * 飞机带单
     */
    static Cards_Type_Triple_Straight_Append_Single: number = 71;
    /**
     * 飞机带对
     */
    static Cards_Type_Triple_Straight_Append_Double: number = 72;
    /**
     * 炸弹
     */
    static Cards_Type_Bomb: number = 80;
    /**
     * 王炸
     */
    static Cards_Type_Joker_Bomb: number = 90;

}
