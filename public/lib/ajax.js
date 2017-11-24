var _App;
(function($) {
	"use strict";

	var toGet = function(obj) {
		var str = "";
		for (var key in obj) {
			if (str != "") {
				str += "&";
			}
			str += key + "=" + encodeURIComponent(obj[key]);
		}
		return (str);
	};

	$.ajax = function(o) {
		var p = new $.promise(), header = o.headers || {};
		var xhr = new XMLHttpRequest();
		var url = o.url;

		try {
			xhr.open(o.method, url + ((typeof(o.data) === 'object' && o.method == 'GET') ? '?' + toGet(o.data) : ''), true);
			for (var i in header) {
				xhr.setRequestHeader(i, header[i]);
			}

			xhr.onreadystatechange = function () {
				if (xhr.readyState === XMLHttpRequest.DONE) {
					var out = xhr.responseText;
					try {
						out = JSON.parse(out);
					} catch (e) {
					}

					if (xhr.status >= 200 && xhr.status <= 300) {
						p.resolve(out)
					} else {
						p.reject(out);
					}
				}
			};

			if (o.timeout) {
				xhr.timeout = o.timeout;
			}

			if (typeof(o.data) === 'object' && o.method != 'GET') {
				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.send(JSON.stringify(o.data));
			} else {
				xhr.send(o.data || '');
			}
		} catch (e) {
			console.log('ajax error', o, e);
			p.reject(e);
		}

		return (p);
	};
})(_App || (_App = {}));