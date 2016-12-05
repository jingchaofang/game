(function(ns){

var ReadyScene = ns.ReadyScene = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function(properties){
        ReadyScene.superclass.constructor.call(this, properties);
        this.init(properties);
    },

    init: function(properties){
        
        // 擂台左
        var ringLeft = new Hilo.Bitmap({
            image: properties.image,
            rect: [0, 0, 290, 204]
        });

        // 擂台右
        var ringRight = new Hilo.Bitmap({
            image: properties.image,
            rect: [300, 0, 290, 204]
        });

        // Hero准备状态
        var heroReady = new Hilo.Bitmap({
            id: 'heroReady',
            image: properties.role,
            rect: [0, 0, 238, 328]
        });

        // Hero死掉了
        var heroDead = new Hilo.Bitmap({
            id: 'heroDead',
            image: properties.role,
            rect: [1450, 0, 294, 301]
        });

        // Hero胜利
        var heroVictory = new Hilo.Bitmap({
            id: 'heroVictory',
            image: properties.role,
            rect: [1180, 0, 269, 328]
        });

        // Hero失败
        var heroDefeat = new Hilo.Bitmap({
            id: 'heroDefeat',
            image: properties.role,
            rect: [940, 0, 238, 328]
        });

        // NPC准备状态
        var npcReady = new Hilo.Bitmap({
            id: 'npcReady',
            image: properties.role,
            rect: [0, 328, 242, 335]
        });

        // NPC死掉了
        var npcDead = new Hilo.Bitmap({
            id: 'npcDead',
            image: properties.role,
            rect: [1410, 328, 293, 307]
        });

        // NPC胜利
        var npcVictory = new Hilo.Bitmap({
            id: 'npcVictory',
            image: properties.role,
            rect: [1156, 328, 253, 335]
        });

        // NPC失败
        var npcDefeat = new Hilo.Bitmap({
            id: 'npcDefeat',
            image: properties.role,
            rect: [912, 328, 242, 335]
        });

        // 金币计数背景图
        var goldCal = new Hilo.Bitmap({
            id: 'goldCal',
            image: properties.gd,
            rect: [180, 0, 90, 90]
        });

        // 计数数字
        var num4 = new Hilo.Text({
            text: '423434234',
            textAlign: 'center',
            textVAlign: 'middle',
            color: 'red'
        });
        num4.setFont('45px arial');

        // 捕获的金币1
        var golded1 = new Hilo.Bitmap({
            id: 'golded1',
            image: properties.gd,
            rect: [270, 10, 90, 90]
        });
        // 捕获的金币2
        var golded2 = new Hilo.Bitmap({
            id: 'golded2',
            image: properties.gd,
            rect: [270, 10, 90, 90]
        });
        // 捕获的金币2
        var golded3 = new Hilo.Bitmap({
            id: 'golded3',
            image: properties.gd,
            rect: [270, 10, 90, 90]
        });
        // 结果平
        var resultDraw = new Hilo.Bitmap({
            id: 'resultDraw',
            image: properties.result,
            rect: [0, 0, 141, 141]
        });
        // 结果Hero胜
        var resultHeroV = new Hilo.Bitmap({
            id: 'resultHeroV',
            image: properties.result,
            rect: [142, 0, 141, 141]
        });

        // 结果NPC胜
        var resultNpcV = new Hilo.Bitmap({
            id: 'resultNpcV',
            image: properties.result,
            rect: [142, 0, 141, 141]
        });

        // 放置
        goldCal.x = 600;
        goldCal.y = 1102;
        goldCal.visible = 0;

        golded1.x = 480;
        golded1.y = 1110;
        golded1.visible = 0;

        golded2.x = 520;
        golded2.y = 1110;
        golded2.visible = 0;

        golded3.x = 560;
        golded3.y = 1110;
        golded3.visible = 0;
        
        ringLeft.x = 0;
        ringLeft.y = this.height - ringLeft.height;
        ringRight.x = this.width - ringRight.width;
        ringRight.y = this.height - ringRight.height;

        heroReady.x = 459;
        heroReady.y = 751;

        npcReady.x = 34;
        npcReady.y = 744;
        heroReady.visible = 1;

        heroDead.visible = 0;
        heroDead.x = 420;
        heroDead.y = 810;

        npcDead.visible = 0;
        npcDead.x = 34;
        npcDead.y = 810;

        heroVictory.visible = 0;
        heroVictory.x = 420;
        heroVictory.y = 751;

        npcVictory.visible = 0;
        npcVictory.x = 34;
        npcVictory.y = 744;

        heroDefeat.x = 459;
        heroDefeat.y = 751;
        heroDefeat.visible = 0;

        npcDefeat.x = 34;
        npcDefeat.y = 744;
        npcDefeat.visible = 0;

        resultHeroV.x = 490;
        resultHeroV.y = 500;
        resultHeroV.visible = 0;

        resultNpcV.x = 80;
        resultNpcV.y = 500;
        resultNpcV.visible = 0;

        resultDraw.x = 290;
        resultDraw.y = 500;
        resultDraw.visible = 0;
        resultDraw.depth = 100;

        // 置入
        this.addChild(
            ringLeft,
            ringRight,
            npcReady,
            heroReady,
            golded1,
            golded2,
            golded3,
            goldCal,
            heroDead,
            npcDead,
            npcVictory,
            heroVictory,
            heroDefeat,
            npcDefeat,
            resultHeroV,
            resultNpcV,
            resultDraw
        );
    }
});

})(window.game);