/**
 * @file 开始倒计时动画
 * @author jingchaofang
 */
(function(ns){

var Start = ns.Start = Hilo.Class.create({
    Extends: Hilo.Sprite,
    constructor: function(properties){
        Start.superclass.constructor.call(this, properties);
        this.addFrame(properties.atlas.getSprite('start'));
        this.interval = 60;
        this.loop = false;
        this.y = 480;
        this.x = 69;
        this.visible = 0;
        this.stop();
    },
    getReady: function(){
        this.visible = 1;
        this.play();
        this.tween = Hilo.Tween.to(this, {visible:0}, {duration:4000, reverse:false, loop:false});
    }

});

})(window.game);