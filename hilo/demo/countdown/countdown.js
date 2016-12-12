window.onload = function() {
    var stageWidth = innerWidth;
    var stageHeight = innerHeight;
    var stage = new Hilo.Stage({
        container: document.body,
        width: stageWidth,
        height: stageHeight,
        renderType: 'canvas'
    });

    var ticker = new Hilo.Ticker(60);
    ticker.addTick(stage);
    ticker.start();

    var countdown = function(duration, callback) {
        var startTime = new Date().getTime();
        var endTime = startTime + duration * 1000;

        var tickObj = {
            tick: function() {
                var deltaTime = endTime - new Date().getTime();
                if (deltaTime <= 0) {
                    ticker.removeTick(tickObj);
                }
                callback(deltaTime / 1000)
            }
        };
        ticker.addTick(tickObj);
    };

    var t = new Hilo.Text({
        text: ''
    });
    stage.addChild(t);
    countdown(10, function(deltaTime) {
        t.text = deltaTime;
        if (deltaTime <= 0) {
            t.text = 'game over';
        }
    });
}
