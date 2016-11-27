/**
 * Hilo 1.0.1 for standalone
 * Copyright 2016 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;


/**
 * @language=en
 * @private
 * @class image resources loader.
 * @module hilo/loader/ImageLoader
 * @requires hilo/core/Class
 */

/**
 * @language=zh
 * @private
 * @class 图片资源加载器。
 * @module hilo/loader/ImageLoader
 * @requires hilo/core/Class
 */
var ImageLoader = Class.create({
    load: function(data){
        var me = this;
        // https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img
        // https://developer.mozilla.org/zh-CN/docs/Web/HTML/CORS_enabled_image
        // https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS
        // https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-crossorigin
        var image = new Image();
        if(data.crossOrigin){
            image.crossOrigin = data.crossOrigin;
        }

        image.onload = //me.onLoad.bind(image);
        function(){
            me.onLoad(image)
        };
        // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
        image.onerror = image.onabort = me.onError.bind(image);
        // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf
        image.src = data.src + (data.noCache ? (data.src.indexOf('?') == -1 ? '?' : '&') + 't=' + (+new Date) : '');
    },

    onLoad: function(e){
        e = e||window.event;
        var image = e//e.target;
        image.onload = image.onerror = image.onabort = null;
        return image;
    },

    onError: function(e){
        var image = e.target;
        image.onload = image.onerror = image.onabort = null;
        return e;
    }

});
Hilo.ImageLoader = ImageLoader;
})(window);