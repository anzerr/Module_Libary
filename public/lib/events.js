var _App;
(function($) {
	"use strict";

	var trigger = function(event, callback, parent) {
		this._event = event;
		this._callback = callback;
		this._limit = null;
		this._parent = parent;
	};
	trigger.prototype = {
		remove: function() {
			var list = this._parent._eventList[this._event];
			for (var i in list) {
				if (list[i] === this) {
					list[i].splice(i, 1);
					return (true);
				}
			}
			return (false);
		},
		emit: function(data) {
			this._callback(data);
			if ($.defined(this._limit)) {
				this._limit += -1;
			}
		},
		setLimit: function(n) {
			this._limit = n;
		},
		hitLimit: function() {
			return ($.defined(this._limit) && this._limit <= 0);
		}
	};

	var _event = function() {
		this._eventList = {};
		this._max = 10;
		this._current = 0;
	};
	_event.prototype = {
		_overMax: function() {
			if ($.defined(this._max) && this._current > this._max) {
				var e = new Error('get');
				$.console.warn('Warrning: event listiner is at ', this._current, ' current triggers ', e.stack);
			}
		},

		on: function(event, callback) {
			this._overMax();
			if (!$.defined(this._eventList[event])) {
				this._eventList[event] = [];
			}
			this._eventList[event].push(new trigger(event, callback, this));
			return (this);
		},
		once: function(event, callback) {
			var a = new trigger(event, callback, this);
			a.setLimit(1);

			this._overMax();
			if (!$.defined(this._eventList[event])) {
				this._eventList[event] = [];
			}
			this._eventList[event].push(a);
			return (this);
		},
		emit: function(event, data) {
			for (var i in this._eventList[event]) {
				this._eventList[event][i].emit(data);
				if (this._eventList[event][i].hitLimit()) {
					this._eventList[event].splice(i, 1);
				}
			}
			return (this);
		},

		setMaxListeners: function(n) {
			this._max = n;
		},
		removeAllListeners: function(event) { // event
			this._eventList[event] = [];
		},
		listenerCount: function(event) {
			return (this._eventList[event].length)
		},
		removeListener: function(event, call) {
			for (var i in this._eventList[event]) {
				if (this._eventList[event][i]._callback === call) {
					this._eventList[event].splice(i, 1);
					return (true);
				}
			}
			return (false);
		}
	};
	$.event = _event;
	
})(_App || (_App = {}));