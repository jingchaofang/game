(function(ns){

var GD = ns.GD = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function(properties){
        GD.superclass.constructor.call(this, properties);
        // 飞镖和金币组合的总数
        this.numGD = 1;
        // 组合之间的垂直距离
        this.gdSpacingY = 300;
        this.goldNum = 0;
        // 移出屏幕下方的组合数量，一般设置为组合总数的一半
        this.numOffscreenGDs = 1;
        this.collision = '';
        this.gdHeight = 90*2 + 120 + this.gdSpacingY;
        this.reset();
        this.visible = 0;
       
        this.createGD(properties.gd);
        this.moveTween = new Hilo.Tween(this, {visible:1}, {
            onComplete: this.resetGD.bind(this)
        });
    },

    createGD: function(image) {
        for (var i = 0; i < this.numGD; i++ ) {
            // 飞镖
            this.dart = new Hilo.Bitmap({
                id: 'darts' + i,
                image: image,
                rect: [0, 0, 90, 90]
            }).addTo(this);
            // 金币
            this.gold = new Hilo.Bitmap({
                id: 'gold' + i,
                image: image,
                rect: [90, 0, 90, 90]
            }).addTo(this);

            this.placeGD(this.dart, this.gold, i);
        }
    },

    placeGD: function(dart, gold, index) {
        gold.x = (720 - 90)*0.5 >> 0;
        gold.y = 0;
        dart.x = gold.x;
        dart.y = gold.y - 120;
    },

    resetGD: function(){
        var total = this.children.length;
        for(var i = 0; i < this.numOffscreenGDs; i++){
            var dart = this.getChildAt(0);
            var gold = this.getChildAt(1);
            this.setChildIndex(dart, total - 1);
            this.setChildIndex(gold, total - 1);
            this.placeGD(dart, gold, this.numOffscreenGDs + i);
        }

        // 重新确定障碍的y轴坐标
        this.y = 0;
        this.visible = 1;

        // 继续移动
        this.startMove();
        
    },
    // 开始移动
    startMove: function(){
        var targetY = 1080;
        Hilo.Tween._tweens.push(this.moveTween);
        // 设置缓动时间
        this.moveTween.duration = 4000;
        // 设置缓动的变换属性，即y从当前坐标变换到targetY
        this.moveTween.setProps({y:this.y}, {y:targetY});
        // 启动缓动动画
        this.moveTween.start();
        this.gold.visible = 1;
        this.dart.visible = 1;
    },
    // 停止移动
    stopMove: function(){
        if(this.moveTween) this.moveTween.pause();
    },
    // 检测碰撞
    checkCollision: function(role){
        for(var i = 0, len = this.children.length; i < len; i++){

            if(role.hitTestObject(this.children[i], true)) {
                if (i%2 === 0){
                    this.collision = 'dart';
                }else {
                    this.collision = 'gold';
                    this.goldNum += 1;
                }
                return this.collision;
            }
        }
        return this.collision;
    },

    // 统计获得金币的数量。
    calcGoldNum: function() {
        var count = 0;
        count += this.goldNum;
        return count;
    },
    // 重置为初始状态
    reset: function(){
        this.y = 0;
        this.goldNum = 0;
    }
});

})(window.game);