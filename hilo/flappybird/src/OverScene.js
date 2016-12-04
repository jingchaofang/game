
(function(ns){

var OverScene = ns.OverScene = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function(properties){
        OverScene.superclass.constructor.call(this, properties);
        this.init(properties);
    },

    init: function(properties){
        // 结束面板
        var board = new Hilo.Bitmap({
            id: 'board',
            image: properties.image,
            rect: [0, 0, 590, 298]
        });
        // Game Over图片文字
        var gameover = new Hilo.Bitmap({
            id: 'gameover',
            image: properties.image,
            rect: [0, 298, 508, 158]
        });
        // 开始按钮
        var startBtn = new Hilo.Bitmap({
            id: 'start',
            image: properties.image,
            rect: [590, 0, 290, 176]
        });
        // 等级按钮
        var gradeBtn = new Hilo.Bitmap({
            id: 'grade',
            image: properties.image,
            rect: [590, 176, 290, 176]
        });
        // 玩家当前分数
        var scoreLabel = new Hilo.BitmapText({
            id: 'score',
            glyphs: properties.numberGlyphs,
            scaleX: 0.5,
            scaleY: 0.5,
            letterSpacing: 4,
            text: 0
        });
        // 玩家最好成绩
        var bestLabel = new Hilo.BitmapText({
            id: 'best',
            glyphs: properties.numberGlyphs,
            scaleX: 0.5,
            scaleY: 0.5,
            letterSpacing: 4,
            text: 0
        });
        // 白色遮罩效果
        var whiteMask = new Hilo.View({
            id: 'mask',
            width: this.width,
            height: this.height,
            alpha: 0.0,
            background:'#fff'
        });
        // 设置各个元素的坐标位置
        board.x = this.width - board.width >> 1;
        board.y = this.height - board.height >> 1;
        gameover.x = this.width - gameover.width >> 1;
        gameover.y = board.y - gameover.height - 20;
        startBtn.x = board.x - 5;
        startBtn.y = board.y + board.height + 20 >> 0;
        gradeBtn.x = startBtn.x + startBtn.width + 20 >> 0;
        gradeBtn.y = startBtn.y;
        scoreLabel.x = board.x + board.width - 140 >> 0;
        scoreLabel.y = board.y + 90;
        bestLabel.x = scoreLabel.x;
        bestLabel.y = scoreLabel.y + 105;

        this.addChild(gameover, board, startBtn, gradeBtn, scoreLabel, bestLabel, whiteMask);
    },
    // 结束场景显示的时候，不仅需要显示玩家的得分，出现的时候还是带动画效果显示出来的。
    // 这里，我们可以使用之前介绍过的Tween缓动变化类来实现这个过场动画。
    show: function(score, bestScore){
        this.visible = true;
        this.getChildById('score').setText(score);
        this.getChildById('best').setText(bestScore);
        this.getChildById('mask').alpha = 1.0;

        Hilo.Tween.from(this.getChildById('gameover'), {alpha:0}, {duration:100});
        Hilo.Tween.from(this.getChildById('board'), {alpha:0, y:this.getChildById('board').y+150}, {duration:200, delay:200});
        Hilo.Tween.from(this.getChildById('score'), {alpha:0, y:this.getChildById('score').y+150}, {duration:200, delay:200});
        Hilo.Tween.from(this.getChildById('best'), {alpha:0, y:this.getChildById('best').y+150}, {duration:200, delay:200});
        Hilo.Tween.from(this.getChildById('start'), {alpha:0}, {duration:100, delay:600});
        Hilo.Tween.from(this.getChildById('grade'), {alpha:0}, {duration:100, delay:600});
        Hilo.Tween.to(this.getChildById('mask'), {alpha:0}, {duration:400});
    }
});

})(window.game);