var _App;
(function($) {
	"use strict";

	var obj = function() {};
	obj.prototype = {
		/**
		 * Json parse that will catch errors
		 * @param json
		 * @returns {*}
		 */
		parse: function(json) {
			var a = null;
			try {
				a = JSON.parse(json);
			} catch (err) {
				//$.console.error('json decode', str, err.stack);
			}
			return (a);
		},

		/**
		 * Json encode and string will catching errors
		 * @param str
		 * @returns {*}
		 */
		stringify: function(str, replacer, space) {
			var a = null;
			try {
				a = JSON.stringify(str, replacer, space);
			} catch (err) {
				//$.console.error('json encode', str, err.stack);
			}
			return (a);
		},
		encode: function(json) {
			return (this.stringify(json));
		},
		decode: function(str) {
			return (this.parse(str));
		},
		copy: function (obj) {
			var res = (obj instanceof Array) ? [] : {};
			for (var i in obj) {
				if (obj[i] == null) {
					res[i] = null;
				} else if (typeof(obj[i]) == 'object') {
					res[i] = this.copy(obj[i]);
				} else {
					res[i] = obj[i];
				}
			}
			return (res);
		}
	};

	$.json = new obj()
})(_App || (_App = {}));
