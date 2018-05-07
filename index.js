var cacheManager = require('cache-manager');
var redisStore = require('cache-manager-redis');



module.exports = {
	init: function() {
		this.cache = cacheManager.caching({
	store: redisStore,
	host: 'localhost', // default value
	port: 6379, // default value
	db: 0,
	ttl: 60 * 60 * 24
});

	},

	requestReceived: function(req, res, next) {
		this.cache.get(req.prerender.url, function (err, result) {
			if (!err && result) {
				req.prerender.cacheHit = true;
				res.send(200, result);
			} else {
				next();
			}
		});
	},

	beforeSend: function(req, res, next) {
		if (!req.prerender.cacheHit && req.prerender.statusCode == 200) {
			this.cache.set(req.prerender.url, req.prerender.content);
		}
		next();
	}
};
