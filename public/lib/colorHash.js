var _App;
(function($) {
    "use strict";

    var BKDRHash = function(str) {
        var seed = 131;
        var seed2 = 137;
        var hash = 0;
        // make hash more sensitive for short string like 'a', 'b', 'c'
        str += 'x';
        // Note: Number.MAX_SAFE_INTEGER equals 9007199254740991
        var MAX_SAFE_INTEGER = parseInt(9007199254740991 / seed2);
        for(var i = 0; i < str.length; i++) {
            if(hash > MAX_SAFE_INTEGER) {
                hash = parseInt(hash / seed2);
            }
            hash = hash * seed + str.charCodeAt(i);
        }
        return (hash);
    };

    var RGB2HEX = function(RGBArray) {
        var hex = '#';
        RGBArray.forEach(function(value) {
            if (value < 16) {
                hex += 0;
            }
            hex += value.toString(16);
        });
        return (hex);
    };

    var HSL2RGB = function(H, S, L) {
        H /= 360;

        var q = L < 0.5 ? L * (1 + S) : L + S - L * S;
        var p = 2 * L - q;

        return [H + 1/3, H, H - 1/3].map(function(color) {
            if(color < 0) {
                color++;
            }
            if(color > 1) {
                color--;
            }
            if(color < 1/6) {
                color = p + (q - p) * 6 * color;
            } else if(color < 0.5) {
                color = q;
            } else if(color < 2/3) {
                color = p + (q - p) * 6 * (2/3 - color);
            } else {
                color = p;
            }
            return (Math.round(color * 255));
        });
    };

    var ColorHash = function(options) {
        options = options || {};

        var LS = [options.lightness, options.saturation].map(function(param) {
            param = param || [0.35, 0.5, 0.65]; // note that 3 is a prime
            return Object.prototype.toString.call(param) === '[object Array]' ? param.concat() : [param];
        });

        this.L = LS[0];
        this.S = LS[1];

        this.hash = options.hash || BKDRHash;
    };
    ColorHash.prototype = {
        hsl: function(str) {
            var H, S, L;
            var hash = this.hash(str);

            H = hash % 359; // note that 359 is a prime
            hash = parseInt(hash / 360);
            S = this.S[hash % this.S.length];
            hash = parseInt(hash / this.S.length);
            L = this.L[hash % this.L.length];

            return [H, S, L];
        },
        rgb: function(str) {
            var hsl = this.hsl(str);
            return HSL2RGB.apply(this, hsl);
        },
        hex: function(str) {
            var rgb = this.rgb(str);
            return RGB2HEX(rgb);
        }
    };

    $.ColorHash = ColorHash;

})(_App || (_App = {}));