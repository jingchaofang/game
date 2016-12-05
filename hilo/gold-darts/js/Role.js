/**
 * @file 角色动作动画
 * @author jingchaofang
 */
(function(ns){

var heroAct = ns.heroAct = Hilo.Class.create({
    Extends: Hilo.Sprite,
    constructor: function(properties) {
        heroAct.superclass.constructor.call(this, properties);
        this.addFrame(properties.atlas.getSprite('heroAct'));
        this.x = 360;
        this.y = 751;
        this.loop = false;
        this.visible = 0;
        this.interval = 15;
        this.stop();
    },
    action: function() {
        this.play();
        this.visible = 1;
        Hilo.Tween.to(
            this,
            {visible:0},
            {delay:300,reverse:false,loop:false}
        );
    }
});

})(window.game);


(function(ns){

var npcAct = ns.npcAct = Hilo.Class.create({
    Extends: Hilo.Sprite,
    constructor: function(properties) {
        npcAct.superclass.constructor.call(this, properties);
        this.addFrame(properties.atlas.getSprite('npcAct'));
        this.x = 34;
        this.y = 744;
        this.loop = false;
        this.visible = 0;
        this.interval = 15;
        this.stop();
    },
    action: function() {
        this.visible = 1;
        this.play();
        Hilo.Tween.to(
            this,
            {visible:0},
            {delay:300, reverse:false, loop:false}
        );
    }
});

})(window.game);
