'use strict';

var debug = require('debug')('teme-uso-server:admin-route');
var error = require('../error.js');

debug.log = console.info.bind(console);


function adminSecurity(req, res, next) {
	var role = req.user.role;
	if (role === 'admin') {
		next();
	} else {
		var err = error.unauthorized('User is not admin');
		next(err);
	}
}

// adminApp.get('/logout/:tokenId', function(req, res) {
// 	delete tokens[req.params.tokenId];
// 	debug(req.user.userId + ' logged out for ' + req.params.tokenId);
// 	res.status(200).send({ err: 0 });
// });

module.exports.adminSecurity = adminSecurity;