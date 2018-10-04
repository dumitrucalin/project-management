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

	debug('Searching for user ' + username);
	let user = await db.user.findByUsername(username);

	if (!user) {
		var token = createToken();

		await db.user.createUser(username, password, fullName, email, token, groupNames);
		debug('User ' + username + ' created');
		return res.status(200).send({ err: 0, token: token });
	} else {
		debug('The user ' + username + ' already exist');
		return res.status.send({ err: 1, message: 'The user ' + username + ' already exist!' });
	}
});

publicApp.post('/login', async function(req, res) {
	var username = req.body.username;
	var password = req.body.password;

	debug('Searching for user ' + username);
	let user = await db.user.findByUsernameAndPassword(username, password);

	if (user) {
		var token = createToken();

		await db.user.setToken(username, token);
		debug('Login successful');
		return res.status(200).send({ err: 0, token: token });
	} else {
		debug('Username or password incorrect');
		return res.status(200).send({ err: 1, message: 'The username or the password is incorrect!' });
	}
});

privateApp.post('/logout', async function(req, res) {
	debug('Searching for user with a token');
	var user = await db.user.findByToken(req.body.token);

	if (user) {
		await db.user.setToken(user.username, '');
		debug('User found');
		return res.status(200).send({ err: 0 });
	} else {
		debug('Couldn\'t find the given token');
		return res.status(200).send({ err: 1, message: 'Couldn\'t find the user with the given token!' });
	}
});

privateApp.get('/get', async function(req, res) {
	debug('Searching for user with a token');
	var user = await db.user.findByToken(req.token);

	if (user) {
		debug('User found');
		return res.status(200).send({ err: 0, user: user });
	} else {
		debug('Couldn\'t find the given token');
		return res.status(200).send({ err: 1, message: 'Couldn\'t find the user with the given token!' });
	}
});


module.exports.publicRoutes = publicApp;
module.exports.security = security;
module.exports.privateRoutes = privateApp;