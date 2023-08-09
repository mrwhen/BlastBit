
import { _decorator, Component, Node, EventTarget, Input, input, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
// const eventTarget = new EventTarget();

/**
 * Predefined variables
 * Name = Game
 * DateTime = Wed Aug 09 2023 13:53:48 GMT+0800 (中国标准时间)
 * Author = mrwhen
 * FileBasename = Game.ts
 * FileBasenameNoExtension = Game
 * URL = db://assets/scripts/Game.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('Game')
export class Game extends Component {
    // private user_exp = 0;
    
    @property({type:Node})
    private bulletNode: Node = null;

    private gameState:number = 0; // 0 未 1 已 2 结束

    protected onLoad(): void {
        // eventTarget.on('incr_exp', (exp) => {
        //     this.user_exp += exp;
        //     console.log(this.user_exp)
        // });

        // input.on(Input.EventType.TOUCH_START, (event) => {
        //     console.log('TOUCH_START');
        // }, this);

        // input.on(Input.EventType.TOUCH_MOVE, (event) => {
        //     console.log('TOUCH_MOVE');
        // }, this);

        // input.on(Input.EventType.TOUCH_END, (event) => {
        //     console.log('TOUCH_END');
        // }, this);

        // input.on(Input.EventType.TOUCH_CANCEL, (event) => {
        //     console.log('TOUCH_CANCEL');
        // }, this);
    }
    start () {
        // eventTarget.emit('incr_exp', 5)
        // setInterval(() => {
        //     eventTarget.emit('incr_exp', 1);
        // },1000)

        input.on(Input.EventType.TOUCH_START, this.fire, this);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_START, this.fire, this)
    }

    fire() {
        console.log('发射子弹');
        console.log('GameStat:', this.gameState);

        // 子弹已发射或游戏已结束，直接返回
        if (this.gameState!=0) return;

        // 设置子弹状态为已发射
        this.gameState = 1;
        
        // 指定缓动对象
        tween(this.bulletNode)
            .to(0.6, {position: new Vec3(0,600,0)}) // 对象在0.6s内移动目标位置
            .start(); // 启动缓动
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
