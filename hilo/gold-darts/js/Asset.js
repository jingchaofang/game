/**
 * @file 资源预先加载获取处理类
 * @author jingchaofang
 */

(function(ns){

var Asset = ns.Asset = Hilo.Class.create({
    Mixes: Hilo.EventMixin,

    queue: null,
    bg: null,
    startSprite: null,
    ring: null,
    role: null,
    smoke: null,
    gd: null,

    // 资源队列加载
    load: function(){

        var resources = [
            {id:'bg', src:'i/bg.png'},
            {id:'startSprite', src:'i/start_sprite.png'},
            {id:'ring', src:'i/ring.png'},
            {id:'role', src:'i/role.png'},
            {id:'smoke', src:'i/smoke.png'},
            {id:'gd', src:'i/gd.png'},
            {id:'result', src:'i/result.png'},
            {id:'number', src:'i/number.png'},
            {id:'tag', src:'i/tag.png'},
            {id:'cursor', src:'i/cursor.png'}
        ];

        this.queue = new Hilo.LoadQueue();
        this.queue.add(resources);
        this.queue.on('complete', this.onComplete.bind(this));
        this.queue.start();
    },
    // 资源加载完成
    onComplete: function(e){
        // 背景
        this.bg = this.queue.get('bg').content;
        // 倒计时开始
        this.startSprite = new Hilo.TextureAtlas({
            image: this.queue.get('startSprite').content,
            frames: [
                [0, 378, 581, 126],
                [0, 252, 581, 126],
                [0, 126, 581, 126],
                [0, 0, 581, 126]
            ],
            sprites: {
                start: [0, 1, 2, 3]
            }
        });
        // 擂台
        this.ring = this.queue.get('ring').content;
        // 游戏角色
        this.roleImage = this.queue.get('role').content;
        this.role = new Hilo.TextureAtlas({
            image: this.roleImage,
            frames: [
                [0, 0, 238, 328],
                [260, 0, 325, 327],
                [590, 0, 349, 328],
                [940, 0, 238, 328],
                [1180, 0, 269, 328],
                [1450, 0, 294, 301],
                [0, 328, 242, 335],
                [244, 328, 316, 338],
                [562, 328, 349, 335],
                [912, 328, 242, 335],
                [1156, 328, 253, 335],
                [1410, 328, 293, 307]
            ],
            sprites: {
                heroAct: [1],
                npcAct: [7],
                heroDead: [5],
                npcDead: [11],
                heroVictory: [4],
                npcVictory: [10],
                heroDefeat: [3],
                npcDefeat: [9]
            }
        });
        // 主角登场烟雾效果
        this.smoke = new Hilo.TextureAtlas({
            image: this.queue.get('smoke').content,
            frames: [
                [0, 0, 418, 333],
                [418, 0, 418, 333],
                [836, 0, 418, 333]
            ],
            sprites: {
                smoke: [0, 1, 2]
            }
        });
        // 金币和飞镖
        this.gd = this.queue.get('gd').content;
        this.result = this.queue.get('result').content;

        var number = this.queue.get('number').content;
        this.numberGlyphs = {
            4: {image:number, rect:[0,0,21,34]},
            5: {image:number, rect:[21,0,21,34]},
            6: {image:number, rect:[42,0,21,34]},
            7: {image:number, rect:[63,0,21,34]},
            8: {image:number, rect:[84,0,21,34]},
            9: {image:number, rect:[105,0,21,34]}
        };

        this.tag = this.queue.get('tag').content;
        this.cursor = this.queue.get('cursor').content;

        this.queue.off('complete');
        this.fire('complete');
    }
});

})(window.game);