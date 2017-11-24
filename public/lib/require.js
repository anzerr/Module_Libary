var _App;
(function($) {
    "use strict";

    var load = {
        js: function(src) {
            var p = new $.promise(), script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            script.onload = function() {
                p.resolve();
            };
            document.head.appendChild(script);
            return (p);
        },
        css: function(src) {
            var p = new $.promise(), link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = src;
            document.head.appendChild(link);
            var img = document.createElement('img');
            img.onerror = function(){
                p.resolve();
            };
            img.src = src;
            return (p);
        }
    };

    $.require = function(a) {
        var list = ($.is.array(a)) ? a : [a];

        var run = function(i) {
            if (!$.defined(list[i])) {
                return ($.promise().resolve());
            }
            var t = list[i].split('.'), type = t[t.length - 1];
            if (load[type]) {
                return (load[type](list[i]).then(function() {
                    return (run(i + 1));
                }))
            }
            return (run(i + 1));
        };
        return (run(0));
    };

})(_App || (_App = {}));