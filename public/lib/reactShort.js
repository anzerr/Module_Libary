var _App;
(function($) {
	"use strict";

	var obj = function() {
		this._elem = {
			div: 'div',
			a: 'a',
			img: 'img',
            input: 'input',
            button: 'button',
            label: 'label',
			i: 'i',
            h1: 'h1'
		};
	};
	obj.prototype = {
		set: function(name, obj) {
            this._elem[name] = obj;
            return (this);
		},
		get: function() {
			var args = Array.prototype.slice.call(arguments);
			if ($.is.string(args[0])) {
                args[0] = this._elem[args[0]] || args[0];
            }
            return (React.createElement.apply(React.createElement, args));
		},
		create: function(name, obj) {
			if (!$.is.string(name)) {
				return (React.createClass(name));
			}
			this._elem[name] = React.createClass(obj);
			return (this._elem[name]);
		}
	};

	$.react = new obj();
})(_App || (_App = {}));