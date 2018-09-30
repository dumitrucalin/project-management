'use strict';

var express = require('express');
var debug = require('debug')('task-manager:user-routes');
var uuid = require('uuid');
var db = require('../database/database.js');

var publicApp = express.Router();
var privateApp = express.Router();

debug.log = console.info.bind(console);

function createToken() {
	return uuid.v4() + uuid.v4() + uuid.v4() + uuid.v4();
}

function security(req, res, next) {
	let token = null;

	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
		token = req.headers.authorization.split(' ')[1];

	if (!token && req.headers.Authorization && req.headers.Authorization.split(' ')[0] === 'Bearer')
		token = req.headers.Authorization.split(' ')[1];

	if (!token) 
		token = req.query.token;

	if (!token) 
		token = req.body.token;

	req.token = token;
	next();
}

publicApp.post('/signup', async function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var fullName = req.body.fullName;
	var email = req.body.email;
	var groupNames = [];

	debug('Searching for ' + username);
	let user = await db.user.findByUsername(username);

	if (!user) {
		debug('User not found. Saving the new credentials into the database...');
		var token = createToken();

		try {
			await db.user.createUser(username, password, fullName, email, token, groupNames);
			res.status(200).send({err: 0});
		} catch (err) {
			debug(err.message);
		}

	} else {
		// TODO: TOAST FOR EXISTING USER
		debug('User already exist');
	}
});

publicApp.post('/login', async function(req, res) {
	var username = req.body.username;
	var password = req.body.password;

	debug('Searching for ' + username);
	let user = await db.user.findByUsernameAndPassword(username, password);

	if (user) {
		var token = createToken();

		try {
			await db.user.setToken(username, token);
			res.status(200).send({err: 0, token: token});
		} catch (err) {
			debug(err.message);
		}

	} else {
		// TODO: TOAST FOR INCORRECT CREDENTIALS
		debug('Username or password are incorrect');
	}
});

privateApp.post('/logout', async function(req, res) {
	try {
		var user = await db.user.findByToken(req.body.token);
	} catch (err) {
		debug(err.message);
	}

	if (user) {
		debug('Found user');

		try {
			await db.user.setToken(user.username, '');
			res.status(200).send({ err: 0 });
		} catch (err) {
			debug(err.message);
		}

	} else {
		debug('Couldn\'t find the given token');
	}
});

privateApp.get('/get', async function(req, res) {
	try {
		var user = await db.user.findByToken(req.token);
	} catch (err) {
		debug(err.message);
	}

	if (user) {
		debug('Found user');
		res.status(200).send({ err: 0, user: user });

		return true;
	} else {
		debug('User not found');

		return false;
	}
});


module.exports.publicRoutes = publicApp;
module.exports.security = security;
module.exports.privateRoutes = privateApp;