(function(){
// https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onload
window.onload = function(){
    game.init();
}

var game = window.game = {
    width: 0,
    height: 0,

    asset: null,
    stage: null,
    ticker: null,
    state: null,
    score: 0,

    bg: null,
    ground: null,
    bird: null,
    holdbacks: null,
    gameReadyScene: null,
    gameOverScene: null,

    init: function(){
        this.asset = new game.Asset();
        this.asset.on('complete', function(e){
            this.asset.off('complete');
            this.initStage();
        }.bind(this)); // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
        this.asset.load();
    },
    // 初始化舞台，由于我们的图片素材是高清图片，且背景大小为720x1280。因此，我们设定游戏舞台的大小为720x1280，
    // 并设置其x和y轴的缩放比例均为0.5，这样舞台实际的可见大小变为360x640。最后，我们把canvas画布添加到body中。
    initStage: function(){
        this.width = 720;
        this.height = 1280;
        this.scale = 0.5;

        //舞台
        this.stage = new Hilo.Stage({
            renderType:'canvas',
            width: this.width,
            height: this.height,
            scaleX: this.scale,
            scaleY: this.scale
        });
        document.body.appendChild(this.stage.canvas);

        // 启动计时器
        // 设定舞台刷新频率为60fps
        this.ticker = new Hilo.Ticker(60);
        this.ticker.addTick(Hilo.Tween);
        // 把舞台加入到tick队列
        this.ticker.addTick(this.stage);
        // 启动ticker
        this.ticker.start();

        // 绑定交互事件，在此游戏中，玩家只有一种交互方式，在PC端是点击鼠标，在移动端则是触碰屏幕。
        // 因此，首先我们需要让舞台stage能接受mousedown或touchstart事件
        this.stage.enableDOMEvent(Hilo.event.POINTER_START, true);
        this.stage.on(Hilo.event.POINTER_START, this.onUserInput.bind(this));

        // Space键控制
        document.addEventListener('keydown', function(e){
            if(e.keyCode === 32) this.onUserInput(e);
        }.bind(this));

        // 舞台更新
        this.stage.onUpdate = this.onUpdate.bind(this);

        // 初始化
        this.initBackground();
        this.initScenes();
        this.initHoldbacks();
        this.initBird();
        this.initCurrentScore();

        //准备游戏
        this.gameReady();
    },
    // 游戏背景，由于背景是不变的，为了减少canvas的重复绘制，我们采用DOM+CSS来设置背景。
    // 先创建一个div，设置其CSS背景为游戏背景图片，再把它加入到舞台的canvas后面。
    initBackground: function(){
        //背景
        var bgWidth = this.width * this.scale;
        var bgHeight = this.height * this.scale;
        // https://developer.mozilla.org/zh-CN/docs/Web/API/Node/insertBefore
        document.body.insertBefore(Hilo.createElement('div', {
            id: 'bg',
            style: {
                background: 'url(images/bg.png) no-repeat',
                backgroundSize: bgWidth + 'px, ' + bgHeight + 'px',
                position: 'absolute',
                width: bgWidth + 'px',
                height: bgHeight + 'px'
            }
        }), this.stage.canvas);

        // 地面
        // 地面也是背景的一部分，处于画面最下端。地面我们使用可视对象Bitmap类。一般的，不需要使用精灵动画的普通图片对象都可使用此类。
        // Bitmap类只要传入相应的图片image参数即可。此外，为了方便查找对象，一般我们都为可视对象取一个合适的id。
        this.ground = new Hilo.Bitmap({
            id: 'ground',
            image: this.asset.ground
        }).addTo(this.stage);

        //设置地面的y轴坐标
        this.ground.y = this.height - this.ground.height;

        //移动地面
        Hilo.Tween.to(this.ground, {x:-60}, {duration:300, loop:true});
    },
    // 初始化当前分数
    initCurrentScore: function(){
        // 当前分数
        this.currentScore = new Hilo.BitmapText({
            id: 'score',
            glyphs: this.asset.numberGlyphs,
            text: 0
        }).addTo(this.stage);

        // 设置当前分数的位置
        // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
        // 可以这样理解（>>1 最大被2整除的整数商）
        this.currentScore.x = this.width - this.currentScore.width >> 1;
        this.currentScore.y = 180;
    },

    initBird: function(){
        this.bird = new game.Bird({
            id: 'bird',
            atlas: this.asset.birdAtlas,
            startX: 100,
            startY: this.height >> 1,
            groundY: this.ground.y - 12
        }).addTo(this.stage, this.ground.depth - 1);
    },

    initHoldbacks: function(){
        this.holdbacks = new game.Holdbacks({
            id: 'holdbacks',
            image: this.asset.holdback,
            height: this.height,
            startX: this.width * 2,
            groundY: this.ground.y
        }).addTo(this.stage, this.ground.depth - 1);
    },

    initScenes: function(){
        // 准备场景
        this.gameReadyScene = new game.ReadyScene({
            width: this.width,
            height: this.height,
            image: this.asset.ready
        }).addTo(this.stage);

        // 结束场景
        this.gameOverScene = new game.OverScene({
            width: this.width,
            height: this.height,
            image: this.asset.over,
            numberGlyphs: this.asset.numberGlyphs,
            visible: false
        }).addTo(this.stage);

        // 绑定开始按钮事件
        this.gameOverScene.getChildById('start').on(Hilo.event.POINTER_START, function(e){
            e._stopped = true;
            this.gameOverScene.visible = false;
            this.gameReady();
        }.bind(this));
    },
    // 当游戏不在结束状态时，启动游戏，并控制小鸟往上飞
    onUserInput: function(e){
        if(this.state !== 'over'){
            // 启动游戏场景
            if(this.state !== 'playing') this.gameStart();
            // 控制小鸟往上飞
            this.bird.startFly();
        }
    },
    // 在游戏过程中，我们要时刻检测小鸟是否与障碍发生碰撞或飞越成功，是否已经落地，并判断游戏是否结束等。
    // 跟小鸟飞行过程类似，我们可以定义舞台的onUpdate方法来实现
    onUpdate: function(delta){
        if(this.state === 'ready'){
            return;
        }
        // 如果小鸟死亡，则游戏结束
        if(this.bird.isDead){
            this.gameOver();
        }else{
            // 更新玩家得分
            this.currentScore.setText(this.calcScore());
            // 碰撞检测
            if(this.holdbacks.checkCollision(this.bird)){
                this.gameOver();
            }
        }
    },
    // 准备场景
    gameReady: function(){
        this.state = 'ready';
        // 重置分数为0
        this.score = 0;
        this.currentScore.visible = true;
        this.currentScore.setText(this.score);
        // 显示准备场景
        this.gameReadyScene.visible = true;
        // 重置障碍的位置
        this.holdbacks.reset();
        // 准备小鸟
        this.bird.getReady();
    },
    // 开始场景
    gameStart: function(){
        this.state = 'playing';
        // 隐藏准备场景
        this.gameReadyScene.visible = false;
        // 开始从右至左移动障碍
        this.holdbacks.startMove();
    },
    // 结束场景
    gameOver: function(){
        if(this.state !== 'over'){
            // 设置当前状态为结束over
            this.state = 'over';
            // 停止障碍的移动
            this.holdbacks.stopMove();
            // 小鸟跳转到第一帧并暂停
            this.bird.goto(0, true);
            // 隐藏屏幕中间显示的分数
            this.currentScore.visible = false;
            // 显示结束场景
            this.gameOverScene.show(this.calcScore(), this.saveBestScore());
        }
    },
    // 计算得分
    calcScore: function(){
        var count = this.holdbacks.calcPassThrough(this.bird.x);
        return this.score = count;
    },

    saveBestScore: function(){
        var score = this.score, best = 0;
        if(Hilo.browser.supportStorage){
            best = parseInt(localStorage.getItem('hilo-flappy-best-score')) || 0;
        }
        if(score > best){
            best = score;
            localStorage.setItem('hilo-flappy-best-score', score);
        }
        return best;
    }
};

})();