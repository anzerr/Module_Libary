var _App;
(function($) {
	"use strict";

	var obj = function() {};
	obj.prototype = {
		msToTime: (function() {
			var format = function(n) {
				return (((n < 10) ? '0' : '') + n);
			};

			return (function(s) {
				var ms = s % 1000;
				s = (s - ms) / 1000;
				var secs = s % 60;
				s = (s - secs) / 60;
				var mins = s % 60;
				var hrs = (s - mins) / 60;

				return (format(hrs) + ':' + format(mins) + ':' + format(secs));
			});
		})()
	};

	$.format = new obj();
})(_App || (_App = {}));