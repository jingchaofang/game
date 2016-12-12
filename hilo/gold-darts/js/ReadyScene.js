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

        // hero金币计数背景图
        var heroGoldCal = new Hilo.Bitmap({
            id: 'heroGoldCal',
            image: properties.gd,
            rect: [180, 0, 90, 90]
        });

        // hero捕获的金币1
        var heroGolded1 = new Hilo.Bitmap({
            id: 'heroGolded1',
            image: properties.gd,
            rect: [270, 10, 90, 90]
        });
        // hero捕获的金币2
        var heroGolded2 = new Hilo.Bitmap({
            id: 'heroGolded2',
            image: properties.gd,
            rect: [270, 10, 90, 90]
        });
        // hero捕获的金币2
        var heroGolded3 = new Hilo.Bitmap({
            id: 'heroGolded3',
            image: properties.gd,
            rect: [270, 10, 90, 90]
        });

        // npc金币计数背景图
        var npcGoldCal = new Hilo.Bitmap({
            id: 'npcGoldCal',
            image: properties.gd,
            rect: [180, 0, 90, 90]
        });

        // npc捕获的金币1
        var npcGolded1 = new Hilo.Bitmap({
            id: 'npcGolded1',
            image: properties.gd,
            rect: [270, 10, 90, 90]
        });
        // npc捕获的金币2
        var npcGolded2 = new Hilo.Bitmap({
            id: 'npcGolded2',
            image: properties.gd,
            rect: [270, 10, 90, 90]
        });
        // npc捕获的金币2
        var npcGolded3 = new Hilo.Bitmap({
            id: 'npcGolded3',
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

        // NPC名牌
        var npcTag = new Hilo.Bitmap({
            id: 'npcTag',
            image: properties.tag,
            rect: [0, 0, 111, 54]
        });

        // hero名牌
        var heroTag = new Hilo.Bitmap({
            id: 'heroTag',
            image: properties.tag,
            rect: [126, 0, 134, 54]
        });

        // 进度条黑底
        var di = new Hilo.Graphics({
            id:'di'
        });
        di.drawRoundRect(26, 223, 598, 25, 12.5);
        di.beginFill('#000');
        di.lineStyle(1,'#000');
        di.endFill();

        // 进度条滚动进度
        var gun = new Hilo.Graphics({
            id:'gun',
            scaleX: 1,
            x: 27
        });
        
        // 进度条倒计时文本
        var cd = new Hilo.Text({
            id:'cd',
            font: 'bold 43px arial,sans-serif',
            textAlign:'right',
            textVAlign:'middle',
            width: 700,
            height: 472,
            text:'20s'
        });

        // 提示点击
        var cursor = new Hilo.Bitmap({
            id: 'cursor',
            image: properties.cursor,
            rect: [0, 0, 96, 96]
        });

        // 放置
        heroGoldCal.x = 600;
        heroGoldCal.y = 1102;
        heroGoldCal.visible = 0;

        heroGolded1.x = 480;
        heroGolded1.y = 1110;
        heroGolded1.visible = 0;

        heroGolded2.x = 520;
        heroGolded2.y = 1110;
        heroGolded2.visible = 0;

        heroGolded3.x = 560;
        heroGolded3.y = 1110;
        heroGolded3.visible = 0

        npcGoldCal.x = 30;
        npcGoldCal.y = 1102;
        npcGoldCal.visible = 0;

        npcGolded1.x = 150;
        npcGolded1.y = 1110;
        npcGolded1.visible = 0;

        npcGolded2.x = 110;
        npcGolded2.y = 1110;
        npcGolded2.visible = 0;

        npcGolded3.x = 70;
        npcGolded3.y = 1110;
        npcGolded3.visible = 0;

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

        npcTag.x = 0;
        npcTag.y = 680;
        heroTag.x = 586;
        heroTag.y = 680;

        cursor.x = 530;
        cursor.y = 920;
        cursor.visible = 1;
        cursor.scaleX = 0.5;
        cursor.scaleY = 0.5;
        
        // 置入
        this.addChild(
            ringLeft,
            ringRight,
            npcReady,
            heroReady,
            heroGolded1,
            heroGolded2,
            heroGolded3,
            heroGoldCal,
            npcGolded1,
            npcGolded2,
            npcGolded3,
            npcGoldCal,
            heroDead,
            npcDead,
            npcVictory,
            heroVictory,
            heroDefeat,
            npcDefeat,
            resultHeroV,
            resultNpcV,
            resultDraw,
            npcTag,
            heroTag,
            di,
            gun,
            cd,
            cursor
        );
        Hilo.Tween.to(
            cursor,
            {scaleX:1,scaleY:1,alpha:0,pivotX:24,pivotY:24},
            {delay:0,duration:1000, reverse:false, loop:true,ease:Hilo.Ease.Quad.EaseIn}
        );
        Hilo.Tween.to(
            cursor,
            {visible:0},
            {delay:4000,reverse:false,loop:true,ease:Hilo.Ease.Quad.EaseOut}
        );
    }
});

})(window.game);