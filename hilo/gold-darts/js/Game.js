/**
 * @file 游戏主控制台
 * @author jingchaofang
 */
(function() {

window.onload = function(){
    document.body.addEventListener('touchmove', function (e) {
        e.preventDefault();
    });
    // 初始化游戏
    game.init();
}

var game = window.game = {
    // 舞台宽高
    width: 0,
    height: 0,
    // 资源
    asset: null,
    // 舞台
    stage: null,
    // 定时器
    ticker: null,
    // 游戏状态
    state: null,
    // 玩家分数
    heroScore: 0,
    // 非游戏玩家分数
    npcScore: 0,
    // 是否重新开始
    isRestart: false,
    // 开始倒计时图片
    startSprite: null,
    start: null,
    // 游戏准备开始场景
    gameReadyScene: null,
    // 游戏结束场景
    gameOverScene: null,
    // 金币已经被抢走
    goldRob: false,

    // 初始游戏
    init: function() {
        this.asset = new game.Asset();
        this.asset.on('complete', function(e){
            this.asset.off('complete');
            this.initStage();
        }.bind(this));
        this.asset.load();
    },

    // 初始舞台
    initStage: function() {
        this.width = 720;
        this.height = 1280;
        this.scale = window.document.documentElement.clientWidth/720;

        // 舞台
        this.stage = new Hilo.Stage({
            renderType:'canvas',
            width:this.width,
            height:this.height,
            scaleX:this.scale,
            scaleY:this.scale
        });

        document.body.appendChild(this.stage.canvas);
       
        this.ticker = new Hilo.Ticker(60);
        this.ticker.addTick(Hilo.Tween);
        this.ticker.addTick(this.stage);
        this.ticker.start();
        // 金币和飞镖
        this.initGD();
        // 擂台和角色
        this.initScene();
        // 初始化角色动作动画
        this.initNpcAct();
        this.initHeroAct();

        this.gameReady();
    },

    // 初始化擂台角色
    initScene: function() {

        this.gameReadyScene = new game.ReadyScene({
            width: this.width,
            height: this.height,
            image: this.asset.ring,
            role: this.asset.roleImage,
            gd: this.asset.gd,
            result: this.asset.result,
            tag: this.asset.tag,
            cursor: this.asset.cursor
        }).addTo(this.stage);

        this.heroCurrentScore = new Hilo.BitmapText({
            id: 'hScore',
            glyphs: this.asset.numberGlyphs,
            text: 4
        }).addTo(this.stage);
        this.heroCurrentScore.x = 634;
        this.heroCurrentScore.y = 1130;
        this.heroCurrentScore.visible = 0;

        this.npcCurrentScore = new Hilo.BitmapText({
            id: 'nScore',
            glyphs: this.asset.numberGlyphs,
            text: 4
        }).addTo(this.stage);
        this.npcCurrentScore.x = 64;
        this.npcCurrentScore.y = 1130;
        this.npcCurrentScore.visible = 0;
    },
    // 初始化主角动作
    initHeroAct: function() {
        this.heroAct = new game.heroAct({
            id: 'heroAct',
            atlas: this.asset.role
        }).addTo(this.stage);
    },
    // 初始化NPC动作
    initNpcAct: function() {
        this.npcAct = new game.npcAct({
            id: 'npcAct',
            atlas: this.asset.role
        }).addTo(this.stage);
    },
    // 初始化烟雾效果
    initSmoke: function() {
        this.smoke = new game.Smoke({
            id: 'smoke',
            smoke: this.asset.smoke
        }).addTo(this.stage);
    },
    // 初始化倒计时开始
    initStart: function() {
        this.start = new game.Start({
            id: 'start',
            atlas: this.asset.startSprite,
            startX: 100,
            startY: this.height >> 1
        }).addTo(this.stage);
    },
    // 初始化金币和飞镖
    initGD: function() {
        this.gd = new game.GD({
            id: 'gd',
            gd: this.asset.gd
        }).addTo(this.stage);
    },
    // 准备游戏
    gameReady: function() {
        this.ticker.removeTick(this.tickObj);
        this.randomNum = Math.random()*10 >>0;

        var me = this;
        // 倒计时文本
        var cd = me.gameReadyScene.getChildById('cd');
        // 进度条滚动进度
        var gun = me.gameReadyScene.getChildById('gun');
        gun.beginFill('#ff0202');
        gun.drawRoundRect(0, 224, 596, 23, 11.5);
        gun.endFill();
        me.countdown = function(duration, callback) {
            var startTime = new Date().getTime();
            var endTime = startTime + duration * 1000;
            var widths = 0;
            me.tickObj = {
                tick: function() {
                    var deltaTime = endTime - new Date().getTime();
                    cd.text = (deltaTime/1000>>0) + 's';
                    // gun.scaleX -= 0.00088;
                    gun.scaleX = 1 * (deltaTime/(duration*1000));
                    if (deltaTime <= 0) {
                        gun.scaleX = 0;
                        me.ticker.removeTick(me.tickObj);
                    }
                    callback(deltaTime / 1000);
                }
            };
            me.ticker.addTick(me.tickObj);
        };

        if (!this.isRestart) {
            // 是否再来一局
            this.isRestart = true;
            // 初始化倒计时开始
            this.initStart();

            var self = this;
            var t = setTimeout(function(){
                // 4000毫秒后开启点击事件
                self.stage.enableDOMEvent(Hilo.event.POINTER_START, true);
                // 倒计时操作
                self.countdown(20, function(deltaTime) {
                    if (deltaTime <= 0) {
                        if (self.heroScore > self.npcScore){
                            self.gameOver({result:'win', status:'win'});
                        }
                        else if(self.heroScore == self.npcScore) {
                            self.gameOver({result:'lose', status: 'draw'});
                        }
                        else {
                            self.gameOver({result:'lose', status:'lose'});
                        }
                    }
                });

            },4000);
            // 绑定点击事件
            this.stage.on(Hilo.event.POINTER_START, this.onUserInput.bind(this));
            // 绑定舞台更新
            this.stage.onUpdate = this.onUpdate.bind(this);
            // 开启倒计时动画
            this.start.getReady();
        }
        else {
            // 倒计时操作
            var self = this;
            self.countdown(20, function(deltaTime) {
                if (deltaTime <= 0) {
                    if (self.heroScore > self.npcScore){
                        self.gameOver({result:'win', status:'win'});
                    }
                    else if(self.heroScore == self.npcScore) {
                        self.gameOver({result:'lose', status: 'draw'});
                    }
                    else {
                        self.gameOver({result:'lose', status:'lose'});
                    }
                }
            });
        }
        
        this.gameReadyScene.getChildById('heroReady').visible = 0;
        Hilo.Tween.to(this.gameReadyScene.getChildById('heroReady'), {visible:1}, {delay:500, reverse:false, loop:false});
        this.state = 'ready';
        // 初始烟雾登场效果
        this.initSmoke();
        this.npcScore = 0;
        this.heroScore = 0;
        // 金币飞镖重置
        this.gd.reset();
        // 开启烟雾动画
        this.smoke.getReady();
        // 开启金币飞镖移动动画
        this.gd.startMove();

        // NPC定时动作
        var self = this;
        var npcReady = self.gameReadyScene.getChildById('npcReady');
        var npcDead = self.gameReadyScene.getChildById('npcDead');
        var heroReady = self.gameReadyScene.getChildById('heroReady');
        var heroVictory = self.gameReadyScene.getChildById('heroVictory');
        var resultHeroV = self.gameReadyScene.getChildById('resultHeroV');
       
        // clearInterval(self.t);
        // self.t = setInterval(function() {
        //     // if(self.gd.y < 700 || self.gd.y > 800){
        //         npcReady.visible = 0;
        //         self.npcAct.action();
        //         Hilo.Tween.to(npcReady, {visible:1}, {delay:300, reverse:false, loop:false});
        //     // }
        // }, 3400);
        // self.t = setInterval(function() {

        //     if(self.gd.y < 700 || self.gd.y > 800){
        //         npcReady.visible = 0;
        //         self.npcAct.action();
        //         Hilo.Tween.to(npcReady, {visible:1}, {delay:300, reverse:false, loop:false});
        //     }

        //     // // 金币到达指定范围
        //     // if (self.gd.y > 700 && self.gd.y < 800 ) {
        //     //     self.gd.gold.visible = 0;
        //     //     self.npcScore +=1;
        //     // }
        //     // // 飞镖到达指定范围
        //     // else if (self.gd.y > 810 && self.gd.y < 890) {
        //     //     self.gd.dart.visible = 0;
        //     //     Hilo.Tween.to(npcReady, {visible:0}, {delay:300, reverse:false, loop:false});
        //     //     Hilo.Tween.to(npcDead, {visible:1}, {delay:300, reverse:false, loop:false});
        //     //     Hilo.Tween.to(heroReady, {visible:0}, {delay:300, reverse:false, loop:false});
        //     //     Hilo.Tween.to(heroVictory, {visible:1}, {delay:300, reverse:false, loop:false});
        //     //     Hilo.Tween.to(resultHeroV, {visible:1}, {delay:300, reverse:false, loop:false});
        //     //     self.gameOver({result:'win'}); // 不用传status
        //     // }

        // }, 4000);
        
    },
    // 游戏结束
    gameOver: function(data) {
        if(this.state !== 'over'){
            // 设置当前状态为结束over
            clearInterval(this.t);
            this.state = 'over';
            this.gd.stopMove();
            this.ticker.removeTick(this.tickObj);
            this.stage.enableDOMEvent(Hilo.event.POINTER_START, false);

            if(data.status == 'draw'){
                Hilo.Tween.to(this.gameReadyScene.getChildById('resultDraw'), {visible:1}, {delay:300, reverse:false, loop:false});
                console.log('平了');
            }else if (data.status == 'win') {
                Hilo.Tween.to(this.gameReadyScene.getChildById('npcReady'), {visible:0}, {delay:300, reverse:false, loop:false});
                Hilo.Tween.to(this.gameReadyScene.getChildById('heroReady'), {visible:0}, {delay:300, reverse:false, loop:false});
                Hilo.Tween.to(this.gameReadyScene.getChildById('resultHeroV'), {visible:1}, {delay:300, reverse:false, loop:false});
                Hilo.Tween.to(this.gameReadyScene.getChildById('heroVictory'), {visible:1}, {delay:300, reverse:false, loop:false});
                Hilo.Tween.to(this.gameReadyScene.getChildById('npcDefeat'), {visible:1}, {delay:300, reverse:false, loop:false});
                console.log('赢了');
            }else if (data.status == 'lose') {
                Hilo.Tween.to(this.gameReadyScene.getChildById('npcReady'), {visible:0}, {delay:300, reverse:false, loop:false});
                Hilo.Tween.to(this.gameReadyScene.getChildById('heroReady'), {visible:0}, {delay:300, reverse:false, loop:false});
                Hilo.Tween.to(this.gameReadyScene.getChildById('resultNpcV'), {visible:1}, {delay:300, reverse:false, loop:false});
                Hilo.Tween.to(this.gameReadyScene.getChildById('npcVictory'), {visible:1}, {delay:300, reverse:false, loop:false});
                Hilo.Tween.to(this.gameReadyScene.getChildById('heroDefeat'), {visible:1}, {delay:300, reverse:false, loop:false});
                console.log('输了');
            }
            
            if(typeof(gameOverCallback) == 'function'){
                gameOverCallback(data);
            }
        }

    },
    // 用户点击交互
    onUserInput: function(e){
        if(this.state !== 'over') {
            this.gameStart();
        }
        var gdY = this.gd.y;
        if (gdY > 700 && gdY < 800 && !this.goldRob) {
            this.goldRob = true;
            this.stage.enableDOMEvent(Hilo.event.POINTER_START, false);
            this.gd.gold.visible = 0;
            this.heroScore += 1;

            switch(this.heroScore) {
                case 1:
                this.gameReadyScene.getChildById('heroGolded1').visible = 1;
                break;
                case 2:
                this.gameReadyScene.getChildById('heroGolded2').visible = 1;
                break;
                case 3:
                this.gameReadyScene.getChildById('heroGolded3').visible = 1;
                break;
                case 4:
                this.gameReadyScene.getChildById('heroGoldCal').visible = 1;
                this.heroCurrentScore.setText(4);
                this.heroCurrentScore.visible = 1;
                break;
                case 5:
                this.gameReadyScene.getChildById('heroGoldCal').visible = 1;
                this.heroCurrentScore.setText(5);
                break;
                case 6:
                this.gameReadyScene.getChildById('heroGoldCal').visible = 1;
                this.heroCurrentScore.setText(6);
                break;
                case 7:
                this.gameReadyScene.getChildById('heroGoldCal').visible = 1;
                this.heroCurrentScore.setText(7);
                break;
                case 8:
                this.gameReadyScene.getChildById('heroGoldCal').visible = 1;
                this.heroCurrentScore.setText(8);
                break;
                case 9:
                this.gameReadyScene.getChildById('heroGoldCal').visible = 1;
                this.heroCurrentScore.setText(9);
                break;
            }
            
        }
        else if (gdY > 810 && gdY < 890) { // 主角中飞镖
            this.stage.enableDOMEvent(Hilo.event.POINTER_START, false);
            this.gd.dart.visible = 0;
            Hilo.Tween.to(this.gameReadyScene.getChildById('heroReady'), {visible:0}, {delay:300, reverse:false, loop:false});
            Hilo.Tween.to(this.gameReadyScene.getChildById('heroDead'), {visible:1}, {delay:300, reverse:false, loop:false});
            Hilo.Tween.to(this.gameReadyScene.getChildById('npcReady'), {visible:0}, {delay:300, reverse:false, loop:false});
            Hilo.Tween.to(this.gameReadyScene.getChildById('npcVictory'), {visible:1}, {delay:300, reverse:false, loop:false});
            Hilo.Tween.to(this.gameReadyScene.getChildById('resultNpcV'), {visible:1}, {delay:300, reverse:false, loop:false});
            this.gameOver({result:'lose'}); // 不用传status
            this.ticker.removeTick(this.tickObj);
        }
        
    },
    gameStart: function() {
        var heroReady = this.gameReadyScene.getChildById('heroReady');
        heroReady.visible = 0;
        this.heroAct.action();
        Hilo.Tween.to(heroReady, {visible:1}, {delay:300, reverse:false, loop:false});
    },
    // 再玩一次
    gameRestart: function() {
        this.gameReadyScene.getChildById('npcVictory').visible = 0;
        this.gameReadyScene.getChildById('npcDefeat').visible = 0;
        this.gameReadyScene.getChildById('resultNpcV').visible = 0;
        this.gameReadyScene.getChildById('resultHeroV').visible = 0;
        this.gameReadyScene.getChildById('resultDraw').visible = 0;
        this.gameReadyScene.getChildById('heroVictory').visible = 0;
        this.gameReadyScene.getChildById('heroDefeat').visible = 0;
        this.gameReadyScene.getChildById('heroDead').visible = 0;
        this.gameReadyScene.getChildById('npcDead').visible = 0;
        this.gameReadyScene.getChildById('heroGolded1').visible = 0;
        this.gameReadyScene.getChildById('heroGolded2').visible = 0;
        this.gameReadyScene.getChildById('heroGolded3').visible = 0;
        this.gameReadyScene.getChildById('heroGoldCal').visible = 0;
        this.gameReadyScene.getChildById('npcGolded1').visible = 0;
        this.gameReadyScene.getChildById('npcGolded2').visible = 0;
        this.gameReadyScene.getChildById('npcGolded3').visible = 0;
        this.gameReadyScene.getChildById('npcGoldCal').visible = 0;
        this.gameReadyScene.getChildById('heroReady').visible = 1;
        this.gameReadyScene.getChildById('npcReady').visible = 1;

        this.heroCurrentScore.visible = 0;
        this.npcCurrentScore.visible = 0;
        this.gd.moveTween.duration = 4000;
        this.start.visible = 0;
        this.gameReadyScene.getChildById('gun').scaleX = 1;
        this.gameReady();
    },
    onUpdate: function() {
        // 金币到达指定范围
        if(this.gd.y >0 && this.gd.y < 10){
            this.goldRob = false;
            // this.npcActed = false;
        }
        // if(this.gd.y > this.randomNum*60 && !this.npcActed) {
        //     this.npcActed = true;
        //     this.gameReadyScene.getChildById('npcReady').visible = 0;
        //     this.npcAct.action();
        //     Hilo.Tween.to(this.gameReadyScene.getChildById('npcReady'), {visible:1}, {delay:300, reverse:false, loop:false});
        // }
        if(!this.goldRob){
            if (this.gd.y > 780 && this.gd.y < 800 ) {
                this.goldRob = true;
                this.gameReadyScene.getChildById('npcReady').visible = 0;
                this.npcAct.action();
                Hilo.Tween.to(this.gameReadyScene.getChildById('npcReady'), {visible:1}, {delay:300, reverse:false, loop:false});
                this.gd.gold.visible = 0;

                this.npcScore +=1;
                console.log(this.npcScore);
                
                switch(this.npcScore) {
                    case 1:
                    this.gameReadyScene.getChildById('npcGolded1').visible = 1;
                    break;
                    case 2:
                    this.gameReadyScene.getChildById('npcGolded2').visible = 1;
                    break;
                    case 3:
                    this.gameReadyScene.getChildById('npcGolded3').visible = 1;
                    break;
                    case 4:
                    this.gameReadyScene.getChildById('npcGoldCal').visible = 1;
                    this.npcCurrentScore.setText(4);
                    this.npcCurrentScore.visible = 1;
                    break;
                    case 5:
                    this.gameReadyScene.getChildById('npcGoldCal').visible = 1;
                    this.npcCurrentScore.setText(5);
                    break;
                    case 6:
                    this.gameReadyScene.getChildById('npcGoldCal').visible = 1;
                    this.npcCurrentScore.setText(6);
                    break;
                    case 7:
                    this.gameReadyScene.getChildById('npcGoldCal').visible = 1;
                    this.npcCurrentScore.setText(7);
                    break;
                    case 8:
                    this.gameReadyScene.getChildById('npcGoldCal').visible = 1;
                    this.npcCurrentScore.setText(8);
                    break;
                    case 9:
                    this.gameReadyScene.getChildById('npcGoldCal').visible = 1;
                    this.npcCurrentScore.setText(9);
                    break;
                }
            }
        }
        // 防止多次获取金币
        if ((this.gd.y > 800 && this.gd.y < 810) || this.gd.y > 0 && this.gd.y < 10) {
            this.stage.enableDOMEvent(Hilo.event.POINTER_START, true);
        }
    }

}

})();