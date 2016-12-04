/**
 * @file 游戏主控制台
 */
(function() {

window.onload = function(){
    // 初始化游戏
    game.init();
}

var game = window.game = {

    width: 0,
    height: 0,

    asset: null,
    stage: null,
    ticker: null,
    // 游戏状态
    state: null,
    // 游戏结果
    heroScore: 0,
    npcScore: 0,
    isRestart: false,
    startT: 0,
    nowT: 0,
    intervalT: 0,
    startSprite: null,
    start: null,
    holdbacks: null,
    // 游戏准备开始场景
    gameReadyScene: null,
    // 游戏结束场景
    gameOverScene: null,

    init: function() {
        this.asset = new game.Asset();
        this.asset.on('complete', function(e){
            this.asset.off('complete');
            this.initStage();
        }.bind(this));
        this.asset.load();
    },

    // 初始化舞台
    initStage: function() {
        this.width = 720;
        this.height = 1280; //1278
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
        var loaded = false;
       
        this.ticker = new Hilo.Ticker(60);
        this.ticker.addTick(Hilo.Tween);
        this.ticker.addTick(this.stage);
        this.ticker.start();
        
        
        // 擂台和角色
        this.initScene();
        // 初始化角色
        this.initNpcAct();
        this.initHeroAct();   
        // 金币和飞镖
        this.initGD();

        // 准备游戏
        if (typeof beforeGame == 'function' && !beforeGame()){
            return;
        }
        this.gameReady();
    },

    // 初始化擂台角色
    initScene: function() {
        this.gameReadyScene = new game.ReadyScene({
            width: this.width,
            height: this.height,
            image: this.asset.ring,
            role: this.asset.roleImage,
            gd: this.asset.gd
        }).addTo(this.stage);
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
        if (!this.isRestart) {
            this.isRestart = true;
            // 倒计时
            this.initStart();
            // 开启事件
            var self = this;
            var t = setTimeout(function(){
                 self.stage.enableDOMEvent(Hilo.event.POINTER_START, true);
            },4000);
            
            this.stage.on(Hilo.event.POINTER_START, this.onUserInput.bind(this));
            // 舞台更新
            this.stage.onUpdate = this.onUpdate.bind(this);
        }
        

        this.gameReadyScene.getChildById('heroReady').visible = 0;
        Hilo.Tween.to(this.gameReadyScene.getChildById('heroReady'), {visible:1}, {delay:400, reverse:false, loop:false});
      
        // 烟雾效果
        this.initSmoke();
        this.startT = +new Date();
        this.npcScore = 0;
        this.heroScore = 0;
        this.state = 'ready';
        // console.log(this.state);
        this.score = 0;
        // NPC定时动作,TODO:NPC4000延迟毫秒开始防未开始前触发金币和飞镖
        var self = this;
        self.t = setInterval(function(){
            self.gameReadyScene.getChildById('npcReady').visible = 0;
            self.npcAct.action();

            Hilo.Tween.to(self.gameReadyScene.getChildById('npcReady'), {visible:1}, {delay:300, reverse:false, loop:false});

            var gdY = self.gd.y >> 0;
            if (gdY > 700 && gdY < 800 ) {
                self.gd.gold.visible = 0;
                self.npcScore +=1;
                console.log("npcScore:" + self.npcScore);
            }
            
            else if (gdY > 810 && gdY < 890) {
                self.gd.dart.visible = 0;
                Hilo.Tween.to(self.gameReadyScene.getChildById('npcReady'), {visible:0}, {delay:300, reverse:false, loop:false});
                Hilo.Tween.to(self.gameReadyScene.getChildById('npcDead'), {visible:1}, {delay:300, reverse:false, loop:false});
                Hilo.Tween.to(self.gameReadyScene.getChildById('heroReady'), {visible:0}, {delay:300, reverse:false, loop:false});
                Hilo.Tween.to(self.gameReadyScene.getChildById('heroVictory'), {visible:1}, {delay:300, reverse:false, loop:false});
                self.gameOver();
                // self.gameOver({result:"lose"});
            }
        },3000); // 3600可测试中镖 3400测试金币

        // this.currentScore.visible = true;
        // this.currentScore.setText(this.score);
        this.gameReadyScene.visible = true;
        this.gd.reset();
        this.smoke.getReady();
        this.start.getReady();
        this.gd.startMove();
    },
    gameOver: function(data) {
        if(this.state !== 'over'){
            // 设置当前状态为结束over
            this.state = 'over';
            this.gd.stopMove();

            clearInterval(this.t);
            console.log('游戏结束');
            if(typeof(gameOverCallback) == 'function'){
                gameOverCallback(data);
            }
        }

    },
    // 用户点击交互
    onUserInput: function(e){
        if(this.state !== 'over') {
            if(this.state !== 'playing'){
                this.gameStart();
            }
        }
        var gdY = this.gd.y;
        if (gdY > 700 && gdY < 800 ) {
            this.gd.gold.visible = 0;
            this.heroScore +=1;
        }
        else if (gdY > 810 && gdY < 890) {  // 主角中飞镖
            this.gd.dart.visible = 0;
            Hilo.Tween.to(this.gameReadyScene.getChildById('heroReady'), {visible:0}, {delay:300, reverse:false, loop:false});
            Hilo.Tween.to(this.gameReadyScene.getChildById('heroDead'), {visible:1}, {delay:300, reverse:false, loop:false});
            Hilo.Tween.to(this.gameReadyScene.getChildById('npcReady'), {visible:0}, {delay:300, reverse:false, loop:false});
            Hilo.Tween.to(this.gameReadyScene.getChildById('npcVictory'), {visible:1}, {delay:300, reverse:false, loop:false});
            this.gameOver({result:'lose'});
        }  
        
    },
    gameStart: function() {
        this.gameReadyScene.getChildById('heroReady').visible = 0;
        this.heroAct.action();
        Hilo.Tween.to(this.gameReadyScene.getChildById('heroReady'), {visible:1}, {delay:300, reverse:false, loop:false});
    },
    // 再玩一次
    gameRestart: function() {
        this.gameReadyScene.getChildById('npcVictory').visible = 0;
        this.gameReadyScene.getChildById('heroVictory').visible = 0;
        this.gameReadyScene.getChildById('heroDead').visible = 0;
        this.gameReadyScene.getChildById('npcDead').visible = 0;
        this.gameReadyScene.getChildById('heroReady').visible = 1;
        this.gameReadyScene.getChildById('npcReady').visible = 1;
        this.gameReady();
    },
    onUpdate: function(){
        this.nowT = +new Date();
        this.intervalT = this.nowT - this.startT;
        if(this.intervalT > 30000 && this.intervalT < 30100){
            console.log('时间到了');
            if (this.heroScore > this.npcScore){
                console.log('赢了');
                this.gameOver({result:'win'});
            }else if(this.heroScore == this.npcScore) {
                this.gameOver({result:'lose'});
                console.log('平了');
            }else {
                this.gameOver({result:'lose'});
                console.log('输了');
            }
        }
    }

}

})();