
/**
 * 小鸟是游戏的主角，跟其他的对象不同的是，小鸟会扇动翅膀飞行。
 * 因此我们用精灵动画类Sprite来创建小鸟。这里我们实现一个Bird类，继承自Sprite
 */
(function(ns){

var Bird = ns.Bird = Hilo.Class.create({
    Extends: Hilo.Sprite,
    constructor: function(properties){
        Bird.superclass.constructor.call(this, properties);
        // 添加小鸟精灵动画帧
        this.addFrame(properties.atlas.getSprite('bird'));
        // 设置小鸟扇动翅膀的频率
        this.interval = 6;
        // 设置小鸟的中心点位置
        // 小鸟的精灵动画帧可由参数传入的精灵纹理集atlas获得。由于小鸟飞行时，身体会向上仰起，也就是会以身体中心点旋转。
        // 因此，我们需要设置小鸟的中心点位置pivotX和pivotY，而小鸟的宽度和高度分别为86和60，故pivotX和pivotY即为43和30。
        this.pivotX = 43;
        this.pivotY = 30;

        this.gravity = 10 / 1000 * 0.3;
        // 每次点击屏幕小鸟会往上飞，这是高中物理中典型的竖直上抛运动。我们发现，小鸟每次都是往上飞行一个固定的高度flyHeight后再下坠的。 
        // 根据我们以前所学的物理公式：初速度2 = 2 * 距离 * 加速度，我们可以计算出小鸟往上飞的初速度：
        this.flyHeight = 80;
        // 小鸟往上飞的初速度
        this.initVelocity = Math.sqrt(2 * this.flyHeight * this.gravity);
    },
    // 小鸟的起始x坐标
    startX: 0,
    // 小鸟的起始y坐标
    startY: 0,
    // 地面的坐标
    groundY: 0,
    // 重力加速度
    gravity: 0,
    // 小鸟每次往上飞的高度
    flyHeight: 0,
    // 小鸟往上飞的初速度
    initVelocity: 0,
    // 小鸟是否已死亡
    isDead: true,
    // 小鸟是在往上飞阶段，还是下落阶段
    isUp: false,
    // 小鸟往上飞的起始y轴坐标
    flyStartY: 0,
    // 小鸟飞行起始时间
    flyStartTime: 0,

    getReady: function(){
        //设置起始坐标
        this.x = this.startX;
        this.y = this.startY;

        this.rotation = 0;
        this.interval = 6;
        // 恢复小鸟精灵动画
        this.play();
        // 小鸟上下漂浮的动画
        this.tween = Hilo.Tween.to(this, {y:this.y + 10, rotation:-8}, {duration:400, reverse:true, loop:true});
    },
    // 当玩家点击屏幕后，小鸟开始往上飞行，我们定义startFly方法
    startFly: function() {
        // 恢复小鸟状态
        this.isDead = false;
        // 减小小鸟精灵动画间隔，加速小鸟扇动翅膀的频率
        this.interval = 3;
        // 记录往上飞的起始y轴坐标
        this.flyStartY = this.y;
        // 记录飞行开始的时间
        this.flyStartTime = +new Date();
        // 停止之前的缓动动画
        if(this.tween) this.tween.stop();
    },
    // 我们要在每次游戏画面更新渲染小鸟的时候调用此方法来确定当前时刻小鸟的坐标位置。
    // Hilo的可视对象View提供了一个onUpdate方法属性，此方法会在可视对象每次渲染之前调用，于是，我们需要实现小鸟的onUpdate方法
    onUpdate: function(){
        if(this.isDead) return;
        // 飞行时间
        var time = (+new Date()) - this.flyStartTime;
        // 有了初速度，我们就可以根据物理公式：位移 = 初速度 * 时间 - 0.5 * 加速度 * 时间2，计算出任一时刻time小鸟移动的距离
        // 飞行距离
        var distance = this.initVelocity * time - 0.5 * this.gravity * time * time;
        // y轴坐标，进而我们就可以计算出小鸟在任一时刻所在的y轴位置
        var y = this.flyStartY - distance;

        if(y <= this.groundY){
            // 小鸟未落地
            this.y = y;
            if(distance > 0 && !this.isUp){
                // 往上飞时，角度上仰20度
                this.tween = Hilo.Tween.to(this, {rotation:-20}, {duration:200});
                this.isUp = true;
            }else if(distance < 0 && this.isUp){
                // 往下跌落时，角度往下90度
                this.tween = Hilo.Tween.to(this, {rotation:90}, {duration:this.groundY - this.y});
                this.isUp = false;
            }
        }else{
            // 小鸟已经落地，即死亡
            this.y = this.groundY;
            this.isDead = true;
        }
    }
});

})(window.game);