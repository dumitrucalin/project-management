// 'use strict';

var express = require('express');
var debug = require('debug')('teme-uso-server:user-routes');
// var uuid = require('uuid');
// var db = require('../database/database.js');
// var error = require('../error.js');

var publicApp = express.Router();
var privateApp = express.Router();
var adminApp = express.Router();

// debug.log = console.info.bind(console);

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

	// let user;
	if (token) {
		debug('got token', token);

		// var userId = await getAsync(KEY + token);
		// user = await db.user.findByUserId(userId);
	}

	next();
	// }
	// if (user) {
	// 	req.user = user;
	// 	next();
	// } else {
	// 	e = error.unauthorized('Please login first');
	// 	next(e);
}

// privateApp.post('/edit', async function(req, res, next) {
// 	var e;
// 	var userId = req.user.userId;
// 	var firstName = req.body.firstName;
// 	var lastName = req.body.lastName;
// 	var email = req.body.email;
// 	if (firstName || lastName || email) {
// 		try {
// 			await db.user.edit(userId, null, null, email, firstName, lastName);
// 			res.status(200).send({ err: 0 });
// 		} catch (err) {
// 			debug(err.message);
// 			e = error.serverError(err.message);
// 			next(e);
// 		}
// 	} else {
// 		e = error.badRequest('At least one field is required');
// 		next(e);
// 	}
// });

// privateApp.get('/info', async function(req, res) {
// 	debug('User: ' + req.user.userId + 'requested /');
// 	let user = await db.user.findByUserId(req.user.userId);
// 	delete user.password;
// 	delete user._id;
// 	delete user.__v;
// 	res.status(200).send({ err: 0, user });
// });

// privateApp.post('/password/edit', async function(req, res, next) {
// 	var e;
// 	var oldPass = req.body.oldPassword;
// 	var newPass = req.body.newPassword;
// 	if (oldPass && newPass) {
// 		debug('Editing password');
// 		if (oldPass !== newPass) {
// 			let data = await db.user.editPassword(req.user.userId, oldPass, newPass);
// 			if (data.n === 1) {
// 				debug('User ' + req.user.userId + ' changed his password');
// 				res.status(200).send({ err: 0 });
// 			} else {
// 				debug('User ' + req.user.userId + 'password change fail');
// 				e = error.badRequest('Wrong Password');
// 				next(e);
// 			}
// 		} else {
// 			e = error.badRequest('Please do not use the same password');
// 			next(e);
// 		}
// 	} else {
// 		e = error.badRequest('Wrong input');
// 		next(e);
// 	}
// });

// // privateApp.get('/logout', async function(req, res) {
// // 	debug(req.user.userId + ' logged out');
// // 	// await delAsync(KEY + req.token);

// // 	res.status(200).send({ err: 0 });
// // });

// adminApp.post('/update', async function(req, res, next) {
// 	var e;
// 	var userId = req.body.userId;
// 	var username = req.body.username;
// 	var password = req.body.password;
// 	var email = req.body.email;
// 	var firstName = req.body.firstName;
// 	var lastName = req.body.lastName;
// 	var role = req.body.role;

// 	try {
// 		await db.user.edit(userId, username, password, email, firstName, lastName, role);
// 		res.status(200).send({ err: 0 });
// 	} catch (err) {
// 		debug(err);
// 		e = error.serverError(err);
// 		next(e);
// 	}
// });

// adminApp.get('/list', async function(req, res, next) {
// 	var e;
// 	try {
// 		var users = await db.user.listUsers();
// 		for (var user of users) {
// 			delete user.password;
// 			delete user.__v;
// 			delete user._id;
// 		}
// 		res.status(200).send({ err: 0, users });
// 	} catch (err) {
// 		debug('Error listing users');
// 		e = error.serverError(err);
// 		next(e);
// 	}
// });

// adminApp.get('/get/:userId', async function(req, res, next) {
// 	var e;
// 	var userId = req.params.userId;
// 	try {
// 		var user = await db.user.findByUserId(userId);
// 	} catch (err) {
// 		debug(err);
// 		e = error.serverError(err);
// 		next(e);
// 	}
// 	if (user) {
// 		delete user.password;
// 		delete user.__v;
// 		delete user._id;
// 		res.status(200).send({ err: 0, user });
// 	} else {
// 		res.status(200).send({ err: 0, message: 'User not found' });
// 	}
// });

// /**
//  * @api {post} /create Create a user
//  * @apiName CreateUser
//  * @apiGroup User
//  *
//  * @apiParam {String} username Username
//  * @apiParam {String} password Password
//  * @apiParam {String} firstName First name of user
//  * @apiParam {String} email Email of user
//  *
//  * @apiSuccess {Number} err 0 
//  * @apiError {String} err Error
//  * @apiError {String} statusError error
//  */
// adminApp.post('/create', async function(req, res, next) {
// 	var e;
// 	var username = req.body.username;
// 	var password = req.body.password;
// 	var email = req.body.email;
// 	var firstName = req.body.firstName;
// 	var lastName = req.body.lastName;
// 	var role = req.body.role;
// 	try {
// 		var user = await db.user.create(username, password, firstName, lastName, email, role);
// 		if (user) {
// 			delete user._id;
// 			res.status(200).send({
// 				err: 0,
// 				user: user
// 			});

// 		}
// 	} catch (err) {
// 		e = error.serverError(err);
// 		next(e);
// 	}
// });

// adminApp.post('/delete', async function(req, res, next) {
// 	var e;
// 	var userId = req.body.userId;
// 	try {
// 		await db.user.deleteByUserId(userId);
// 		res.status(200).send({ err: 0 });
// 	} catch (err) {
// 		debug(err);
// 		e = error.serverError();
// 		next(e);
// 	}
// });

module.exports.publicRoutes = publicApp;
module.exports.security = security;
module.exports.privateRoutes = privateApp;
module.exports.adminRoutes = adminApp;