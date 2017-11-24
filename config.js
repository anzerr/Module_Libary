"use strict";

module.exports = function() {
	return ({
		route: [
			'config/library.js'
		],
		cdn: [
			{
                path: '/lib/',
                priority: 2,
                source: 'public/lib'
            },
            {
                path: '/public/',
                priority: 1,
                source: 'public'
            }
		],
		import: [
			{
				module: 'generic',
				as: 'webapp',
				path: '/entity/webapp.js'
			}
		]
	});
};
