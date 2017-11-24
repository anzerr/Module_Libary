var _App;
(function($) {
	"use strict";

	var priv = {
		deepMerge: function (a, b) {
			if ($.defined(b)) {
				for (var i in b) {
					if ($.is.object(a[i]) && $.is.object(b[i])) {
						a[i] = this.deepMerge(a[i], b[i]);
					} else {
						a[i] = b[i];
					}
				}
			}
			return (a);
		}
	};

	var obj = {
		merge: function (a, b) {
			if (!$.defined(a) && !$.defined(b)) {
				return ({
					deep: function (a, b) {
						return (priv.deepMerge(a, b));
					}
				})
			}

			if ($.defined(b)) {
				for (var i in b) {
					a[i] = b[i];
				}
			}
			return (a);
		},
		
		copy: (function() {
			var copy = function(data) {
				this._hash = [];
				this._deep = false;
				this._data = data;
				this.copy = ($.is.object(data) && data !== null) ? this._format(data, 0) : data;
			};
			copy.prototype = {
				_format: function(obj, sub) {
					var out = (($.is.array(obj)) ? [] : {});
					this._sub += 1;
					if (this._deep && sub > 20) {
						return (out);
					}

					for (var i in obj) {
						if (obj.hasOwnProperty(i)) {
							if ($.is.object(obj[i]) && obj[i] !== null) {
								var circle = false;
								for (var x in this._hash) {
									if (this._hash[x] == obj[i]) {
										circle = true;
										break;
									}
								}
								if (circle) {
									out[i] = 'circular';
								} else {
									this._hash.push(obj);
									out[i] = this._format(obj[i], sub + 1);
								}
							} else {
								out[i] = obj[i];
							}
						}
					}
					return (out);
				}
			};
			return (function(obj, m) {
				try {
					return (this.merge().deep((new copy(obj)).copy, m));
				} catch (e) {
					$.console.error(e);
				}
				return (null);
			});
		})(),
	};

	$.schema = obj;

})(_App || (_App = {}));