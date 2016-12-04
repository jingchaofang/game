/**
 * 准备场景很简单，由一个Get Ready！的文字图片和TAP提示的图片组成。这里，我们创建一个ReadyScene的类，继承自容器类Container。
 * 它的实现只需要把getready和tap这2个Bitmap对象创建好并放置在适当的位置即可。而它们的图片素材image会传给ReadyScene的构造函数
 */
(function(ns){

var ReadyScene = ns.ReadyScene = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function(properties){
        ReadyScene.superclass.constructor.call(this, properties);
        this.init(properties);
    },

    init: function(properties){
        // 准备Get Ready!
        var getready = new Hilo.Bitmap({
            image: properties.image,
            rect: [0, 0, 508, 158]
        });

        // 开始提示tap
        var tap = new Hilo.Bitmap({
            image: properties.image,
            rect: [0, 158, 286, 246]
        });
        
        // 确定getready和tap的位置
        tap.x = this.width - tap.width >> 1;
        tap.y = this.height - tap.height + 40 >> 1;
        getready.x = this.width - getready.width >> 1;
        getready.y = tap.y - getready.height >> 0;

        this.addChild(tap, getready);
    }
});

})(window.game);