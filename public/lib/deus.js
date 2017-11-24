var _App;
(function($) {
	"use strict";

	var util = {
		upperFist: function(str) {
			return (str.charAt(0).toUpperCase() + str.slice(1).toLowerCase());
		},
		toArray: function(a) {
			var out = [];
			for (var i in a) {
				out.push(a[i]);
			}
			return (out);
		}
	};

	var _store = {},
		_style = {};

	var flat = function(arr) {
		this.elem = arr;
	};

	var obj = function(key, namespace) {
		this._key = key;
		this._namespace = namespace;
		this._class = '';
		this._style = {};
		this._core = {};
		this._hook = {};
	};
	obj.prototype = {
		class: function() {
			for (var i in arguments) {
				if ($.is.string(arguments[i])) {
					this._class = ' ' + arguments[i].trim();
				}
			}
			return (this);
		},
		style: function() {
			for (var i in arguments) {
				if ($.is.object(arguments[i])) {
					this._style = $.schema.merge(this._style, arguments[i]);
				}
				if ($.is.string(arguments[i])) {
					var tmp = arguments[i].split(' ');
					for (var x in tmp) {
						this._style = $.schema.merge(this._style, _style[this._namespace + '.' + tmp[x]] || {});
					}
				}
			}
			return (this);
		},
		on: function(key, func, bubble) {
			this._hook['on' + util.upperFist(key)] = function(e) {
				var a = func(e);
				if (!bubble && e.stopPropagation && e.preventDefault) {
					e.stopPropagation();
					e.preventDefault();
				}
				return (a);
			};
			return (this);
		},
		set: function() {
			for (var i in arguments) {
				if ($.is.object(arguments[i])) {
					this._core = $.schema.merge(this._core, arguments[i]);
				}
			}
			return (this);
		},
		ref: function(ref) {
			this._ref = ref;
			return (this);
		},
		create: function() {
			var data = {style: this._style}, k = ['_hook', '_core'];
			var c = this._class.trim();
			if (c !== '') {
				data.className = c;
			}
			if (this._ref) {
				data.ref = this._ref;
			}
			for (var i in k) {
				data = $.schema.merge(data, this[k[i]]);
			}
			var key = ($.is.string(this._key))? (_store[this._key] || this._key) : this._key, out = [key, data].concat(util.toArray(arguments));
			return (React.createElement.apply(React.createElement, out));
		},
		c: function() {
			return (this.create.apply(this, util.toArray(arguments)));
		}
	};

	var pub = function(key, namespace) {
		return (new obj(key, namespace));
	};
	var tmp = {
		create: function(key, data) {
			if (!$.is.string(key)) {
				return (React.createClass(key));
			}
			_store[key] = React.createClass(data);
			return (_store[key]);
		},
		style: function(key, data) {
			if (!$.defined(data)) {
				return (_style[key] || {});
			}
			_style[key] = data;
			return (this);
		},
		flat: function(arr) {
			return (new flat(arr));
		}
	};
	for (var i in tmp) {
		pub[i] = tmp[i];
	}

	var inter = function(namespace) {
		this._namespace = namespace;
	};
	inter.prototype = {
		pub: function() {
			var self = this, a = function(key) {
				return (pub(key, self._namespace))
			};
			a.create = pub.create;
			a.style = function(key, data) {
				return (pub.style(self._namespace + '.' + key, data));
			};
			return (a)
		}
	};

	$._deus = inter;
})(_App || (_App = {}));