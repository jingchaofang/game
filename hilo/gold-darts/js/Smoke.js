/**
 * @file 烟雾登场效果
 * @author jingchaofang
 */
(function(ns){

var Smoke = ns.Smoke = Hilo.Class.create({
    Extends: Hilo.Sprite,
    constructor: function(properties){
        Smoke.superclass.constructor.call(this, properties);
        this.addFrame(properties.smoke.getSprite('smoke'));
        this.interval = 15;
        this.x = 320;
        this.y = 762;
        this.loop = false;
        this.visible = 0;
        this.stop();
    },
    getReady: function(){
        this.visible = 1;
        this.play();
        Hilo.Tween.remove(this);
        Hilo.Tween.to(this, {visible:false}, {duration:500, reverse:false, loop:false});
    }
});

})(window.game);