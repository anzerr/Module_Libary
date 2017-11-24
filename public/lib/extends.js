var _App;
(function($) {
	"use strict";

	$.extends = function(source, fields) {
		var Inherit = function() {};
		Inherit.prototype = source.prototype;
		var obj = new Inherit();

		for (var name in fields) {
			obj[name] = fields[name];
		}
		if (fields.toString !== Object.prototype.toString) {
			obj.toString = fields.toString;
		}
		return (obj);
	};
	$.extend = $.extends;

})(_App || (_App = {}));