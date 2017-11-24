"use strict";

module.exports = function() {
	return ([
		{
			method: ['get'],
			path: '/lib/json',
			action: {
				controller: 'library',
				method: 'getMap'
			}
		},
		{
			method: ['get'],
			path: '/lib.min',
			action: {
				controller: 'library',
				method: 'getCore'
			}
		},
		{
			method: ['get'],
			path: '/lib.raw',
			action: {
				controller: 'library',
				method: 'getCoreRaw'
			}
		},
		{
			method: ['get'],
			path: '/lib/:file.min',
			param: {file: '.*'},
			action: {
				controller: 'library',
				method: 'get'
			}
		}
	]);
};
