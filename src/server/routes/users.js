// 'use strict';

var express = require('express');
var debug = require('debug')('task-manager:user-routes');
// var uuid = require('uuid');
// var db = require('../database/database.js');
// var error = require('../error.js');

var publicApp = express.Router();
var privateApp = express.Router();
var adminApp = express.Router();

debug.log = console.info.bind(console);

// function createToken() {
// 	return uuid.v4() + uuid.v4() + uuid.v4() + uuid.v4();
// }

// publicApp.post('/login', async function(req, res, next) {
// 	var e;
// 	var username = req.body.username;
// 	var password = req.body.password;
// });

function security(req, res, next) {
	// var e;
	let token = null;
	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token && req.headers.Authorization && req.headers.Authorization.split(' ')[0] === 'Bearer') {
		token = req.headers.Authorization.split(' ')[1];
	}
	if (!token) {
		token = req.query.token;
	}
	if (!token) {
		token = req.body.token;
	}
	req.token = token;
	next();
}

// privateApp.get('/logout', async function(req, res) {
// 	debug(req.user.userId + ' logged out');
// 	await delAsync(KEY + req.token);

// 	res.status(200).send({ err: 0 });
// });


module.exports.publicRoutes = publicApp;
module.exports.security = security;
module.exports.privateRoutes = privateApp;
module.exports.adminRoutes = adminApp;