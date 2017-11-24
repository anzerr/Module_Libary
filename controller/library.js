"use strict";

module.exports = function($) {
	return $.require([
		'import!webapp'
	], function(
		webapp
	) {

		var obj = function() {
			this._priority = {
				'/all.js': 6,
				'/promise.js': 7,
				'/type.js': 8,
				'/defined.js': 8,
				'/react.js': 6,
				'/events.js': 6,
				'/extends.js': 6,
				'/jquery-3.1.1.js': 6
			};
		};
		obj.prototype = $.extends('!controller', {
            _files: function(path, pre) {
                return (webapp.files(path, pre, this._priority).then(function(files) {
                    return (files);
                }));
            },

			get: function(data) {
				var path = $.path('module!/public/lib/' + data.url.substr(4, data.url.length - (4 + 4)));
				return (webapp.minify([path]));
			},

			getCoreRaw: function() {
				var path = $.path('module!/public/lib');
				return (this._files(path, path).then(function(files) {
                    console.log(files);
					return (webapp.minify(files, true));
				}));
			},

			getCore: function() {
				var path = $.path('module!/public/lib');
				return (this._files(path, path).then(function(files) {
					return (webapp.minify(files));
				}));
			},

			getMap: function() {
				var self = this;
				return (this._files($.path('module!/public/lib'), '/lib').then(function(files) {
					return self.res().status(200).data(files);
				}));
			}
		});

		return ({'static private': obj});
	});
};
