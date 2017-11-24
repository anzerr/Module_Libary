var _App;
(function($) {
	"use strict";

	var obj = function() {
		this._list = [];
		this._data = {};
		this._base = window.location.href.split('#')[0];
	};
	obj.prototype = {
		add: function(obj) {
			var base = (obj.path || '').replace(/\//g, '\\/'), url = base;
			for (var i in obj.param) {
				url = url.replace(':' + i, obj.param[i]);
				obj.param[i] = '^' + base.replace(':' + i, '(' + obj.param[i] + ')').replace(/\/:[a-zA-Z0-9]*/g, '/.*') + '$';
			}
			obj.path = '^' + url + '$';
			this._list.push(obj);
			return (this);
		},

		getData: function(key) {
			if ($.defined(key)) {
				return (this._data[key] || null);
			}
			return (this._data);
		},

		run: function(a) {
			var url = ('/' + (a.split('#')[1] || '')).replace(/\/{2,}/g, '/');

			if (a == this._skip) {
				this._skip = null;
				return ($.promise().resolve());
			}

			for (var i in this._list) {
				if (url.match(this._list[i].path)) {
					var data = {}, tmp;
					for (var x in this._list[i].param) {
						if (tmp = RegExp(this._list[i].param[x]).exec(url)) {
							data[x] = tmp[1];
						}
					}
					this._data = data;
					var action = this._list[i].action;
					return $.promise().resolve($.page.get(action.controller)[action.method]({}));
				}
			}

			return $.promise().resolve($.page.get('misc')['404']({}));
		},

		setUrl: function(url) {
			this._skip = this._base + '#' + url;
			window.location.href = this._skip;
			return (this);
		},
		
		redirect: function(url) {
			window.location.href = this._base + '#' + url;
			return (this);
		}
	};

	$.route = new obj();
})(_App || (_App = {}));