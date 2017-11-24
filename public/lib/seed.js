var _App;
(function($) {
	"use strict";

	var seedObj = function(seed) {
		this._seed = seed || 1;
	};
	seedObj.prototype = {
		next: function() {
			this._seed = (this._seed * 9301 + 49297) % 233280;
			return (this._seed / (233280.0));
		},

		setSeed: function(seed) {
			this._seed = seed;
			return (this);
		}
	};

	var obj = function() {
		this._alpha = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	};
	obj.prototype = {
		_genKey: function(n, seed) {
			var seedGen = new seedObj(seed), x = 0.5;
			for (var i = n; i > 0; i--) {
				x = seedGen.next();
			}

			var char = this._alpha.split(''), out = [], s = new seedObj(x * 6800000);

			while (out.length < 8) {
				out.push(char.splice(Math.floor(s.next() * char.length), 1)[0]);
			}

			return (out.join(''));
		},
		gen: function(start, interval, seed) {
			return (this._genKey(Math.floor((new Date().getTime() - start) / interval), seed))
		}
	};

	$.seed = new obj();
})(_App || (_App = {}));