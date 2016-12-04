/**
 * @file 资源处理类
 * 预加载图片:为了让玩家有更流畅的游戏体验，图片素材一般需要预先加载。Hilo提供了一个队列下载工具LoadQueue，使用它可以预加载图片素材。
 * 如下所示，在Asset类中，我们定义了load方法：
 */

(function(ns){

var Asset = ns.Asset = Hilo.Class.create({
    Mixes: Hilo.EventMixin,
    // 队列
    queue: null,
    // 背景
    bg: null,
    // 地面
    ground: null,
    // 预备
    ready: null,
    // 结束
    over: null,
    // 数字字符
    numberGlyphs: null,
    // 小鸟图集
    birdAtlas: null,
    // 障碍
    holdback: null,

    load: function(){
        var resources = [
            {id:'bg', src:'images/bg.png'},
            {id:'ground', src:'images/ground.png'},
            {id:'ready', src:'images/ready.png'},
            {id:'over', src:'images/over.png'},
            {id:'number', src:'images/number.png'},
            {id:'bird', src:'images/bird.png'},
            {id:'holdback', src:'images/holdback.png'}
        ];

        this.queue = new Hilo.LoadQueue();
        this.queue.add(resources);
        // 为了获得下载情况，LoadQueue提供了三个事件：
        // load - 当单个资源下载完成时发生
        // complete - 当所有资源下载完成时发生
        // error - 当某一资源下载出错时发生
        // 在这里我们仅监听了complete事件。
        this.queue.on('complete', this.onComplete.bind(this));
        this.queue.start();
        // 从上面代码中可以看到，resources是我们要下载的图片素材列表，使用queue.add()方法把素材列表加入到下载队列中，
        // 再使用queue.start()方法来启动下载队列。
    },
    // 下载完成后会触发onComplete回调方法。我们可以通过queue.get(id).content来获取指定id的图片素材下载完成后的Image对象。
    // 在这里我们创建了游戏中需要用到的素材以及精灵纹理集等
    onComplete: function(e){
        this.bg = this.queue.get('bg').content;
        this.ground = this.queue.get('ground').content;
        this.ready = this.queue.get('ready').content;
        this.over = this.queue.get('over').content;
        this.holdback = this.queue.get('holdback').content;
        // 其中纹理集TextureAtlas实例由三部分组成：
        // image - 纹理集图片。
        // frames - 纹理集图片帧序列。每个图片帧由图片在纹理集中的坐标x/y和宽高width/height组成，即[x, y, width, height]。
        // sprites - 精灵定义。sprites可包含多个精灵定义。每个精灵由多个frames中的图片帧组成，其中数值代表图片帧在frames中的索引位置。
        // 比如bird，则由索引为0、1、2的图片帧组成。
        this.birdAtlas = new Hilo.TextureAtlas({
            image: this.queue.get('bird').content,
            frames: [
                [0, 120, 86, 60], 
                [0, 60, 86, 60], 
                [0, 0, 86, 60]
            ],
            sprites: {
                bird: [0, 1, 2]
            }
        });

        var number = this.queue.get('number').content;
        this.numberGlyphs = {
            0: {image:number, rect:[0,0,60,91]},
            1: {image:number, rect:[61,0,60,91]},
            2: {image:number, rect:[121,0,60,91]},
            3: {image:number, rect:[191,0,60,91]},
            4: {image:number, rect:[261,0,60,91]},
            5: {image:number, rect:[331,0,60,91]},
            6: {image:number, rect:[401,0,60,91]},
            7: {image:number, rect:[471,0,60,91]},
            8: {image:number, rect:[541,0,60,91]},
            9: {image:number, rect:[611,0,60,91]}
        };
        // 删除下载队列的complete事件监听
        this.queue.off('complete');
        // 发送complete事件
        this.fire('complete');
    }
});

})(window.game);