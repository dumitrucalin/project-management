'use strict';

var express = require('express');
var debug = require('debug')('task-manager:user-routes');
var uuid = require('uuid');
var db = require('../database/database.js');
var error = require('../error.js');

var publicApp = express.Router();
var privateApp = express.Router();

debug.log = console.info.bind(console);

function createToken() {
	return uuid.v4() + uuid.v4() + uuid.v4() + uuid.v4();
}


publicApp.post('/signup', async function(req, res, next) {
	var e;
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;

	if (username && password) {
		debug('Searching for ' + username);
		let user = await db.user.findByUsername(username);
		if (!user) {
			debug('User not found. Saving the new credentials into the database...');
			var token = createToken();
			await db.user.create(username, password, email, token);
			res.status(200).send({err: 0, token: token});
		} else {
			// TODO: TOAST FOR EXISTING USER
			e = error.unauthorized('User already exist');
			return next(e);
		}
	} else {
		// TODO: TOAST FOR INCOMPLETE CREDENTIALS
		e = error.unauthorized('All fields are required');
		return next(e);
	}

	next();
});

publicApp.post('/login', async function(req, res, next) {
	var e;
	var username = req.body.username;
	var password = req.body.password;

	if (username && password) {
		debug('Searching for ' + username);
		let user = await db.user.findByUsername(username);
		if (user) {
			var token = createToken();
			user = await db.user.setToken(username, token);
			res.status(200).send({err: 0, token: token});
		} else {
			// TODO: TOAST FOR INCORRECT CREDENTIALS
			e = error.unauthorized('Username or password are incorrect');
			return next(e);
		}
	} else {
		// TODO: TOAST FOR INCOMPLETE CREDENTIALS
		e = error.unauthorized('All fields are required');
		return next(e);
	}

	next();
});

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

privateApp.post('/logout', async function(req, res) {
	var user = await db.user.findByToken(req.body.token);
	if (user) {
		debug('Found user');
		await db.user.setToken(user.username, '');
		res.status(200).send({ err: 0 });
	} else {
		debug('Couldn\'t find the given token');
	}
});


module.exports.publicRoutes = publicApp;
module.exports.security = security;
module.exports.privateRoutes = privateApp;