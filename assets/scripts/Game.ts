
import { _decorator, Component, Node, EventTarget, Input, input, tween, Vec3, Tween, Director, Label, ParticleAsset, ParticleSystem2D, Sprite } from 'cc';
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

    @property({type:Node})
    private enemyNode: Node = null;

    // 注意label类型，不是node类型？？？？
    @property({type: Label})
    private scoreLabel: Label = null;

    @property({type: Node})
    private boomNode:Node = null;

    private gameState:number = 0; // 0 未 1 已 2 结束
    private bulletTween: Tween<Node> = null;
    private enemyTween: Tween<Node> = null;
    private score = 0;

    // 播放爆破粒子效果
    boom(pos, color) {
        this.boomNode.setPosition(pos);
        let particle = this.boomNode.getComponent(ParticleSystem2D);
        if (color == undefined) {
            particle.startColor = particle.endColor = color;
        }
        particle.resetSystem();
    }

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

        // 让敌人动起来 ？？？不能放到onload里面？？？
        // this.enemyInit();
        this.newLevel()
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_START, this.fire, this)
    }

    fire() {
        console.log('发射子弹');
        console.log('GameState:', this.gameState);

        // 子弹已发射或游戏已结束，直接返回
        if (this.gameState!=0) return;

        // 设置子弹状态为已发射
        this.gameState = 1;
        
        // 指定缓动对象
        this.bulletTween = tween(this.bulletNode)
            .to(0.6, {position: new Vec3(0,600,0)}) // 对象在0.6s内移动目标位置
            .call(() => {this.gameOver();})
            .start(); // 启动缓动
    }

    checkHit() {
        // 不在发射状态，不处理逻辑
        if (this.gameState != 1) return;

        let dis = Vec3.distance(this.bulletNode.position, this.enemyNode.position);
        if (dis < 50) {
            // 关闭子弹发射的动画
            this.bulletTween.stop();
            this.enemyTween.stop();
            // 将子弹状态设置为已结束
            this.gameState = 2;

            // 让子弹和敌人都消失
            this.enemyNode.active = false;
            this.bulletNode.active = false;

            // 播放爆破粒子效果
            let enemyColor = this.enemyNode.getComponent(Sprite).color;// 敌人的颜色
            this.boom(this.bulletNode.position, enemyColor);

            // 增加得分
            this.incrScore();
            // 设置新一轮游戏
            this.newLevel();
        }
    }

    newLevel() {
        this.enemyInit();
        this.bulletInit();
        this.gameState = 0;
    }

    enemyInit() {
        let st_pos = new Vec3(300,260,0); // enemy 初始化位置
        let dua; // 从屏幕右边到左边的时间

        dua = 2.5 - Math.random() * 0.5; // 移动时间随机范围
        st_pos.y = st_pos.y  - Math.random() * 40; // 初始化y轴坐标范围
        // 一半的概率让出现的位置在左边
        if (Math.random() > 0.5) {
            st_pos.x = - st_pos.x;
        }

        this.enemyNode.setPosition(st_pos); // 设置enemy 初始位置
        this.enemyNode.active = true; // 显示敌人节点

        this.enemyTween = tween(this.enemyNode)
        .to(dua, {position: new Vec3(-st_pos.x, st_pos.y, 0)}) // 移动到左侧
        .to(dua, {position: new Vec3(st_pos.x, st_pos.y, 0)}) // 一定到右侧
        .union() // 将上下文的缓动动作进行打包
        .repeatForever() // 重复执行打包的工作
        .start(); // 开始缓动
    }

    bulletInit() {
        let st_pos = new Vec3(0,-340,0)
        this.bulletNode.setPosition(st_pos);
        this.bulletNode.active = true;
    }

    incrScore() {
        this.score = this.score + 1;
        this.scoreLabel.string = String(this.score);
    }

    gameOver() {
        console.log('游戏结束');
        this.gameState = 2;

        // 播放爆破粒子效果
        let bulletColor = this.bulletNode.getComponent(Sprite).color; // 子弹颜色
        this.boom(this.bulletNode.position, bulletColor);

        // 死亡后延时1s显示爆破粒子效果
        setTimeout(()=>{
            Director.instance.loadScene('Game'); // 重新加载Game场景
        },1000);
        
    }

    // 这个方法是一直在执行呀，厉害了
    update (deltaTime: number) {
        console.log("this is update log.");
        this.checkHit();
    }
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
