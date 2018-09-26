'use strict';

var express = require('express');
var debug = require('debug')('task-manager:user-routes');
// var uuid = require('uuid');
var db = require('../database/database.js');
var error = require('../error.js');

var privateApp = express.Router();

debug.log = console.info.bind(console);

privateApp.post('/create', async function(req, res, next) {
	var e;
	var groupName = req.body.groupName;
	var users = req.body.users;
	debug('Searching for group ' + groupName);
	var group = await db.group.findByGroupName(groupName);
	if (!group) {
		await db.group.create(groupName);
		await db.group.updateUsers(users);
		res.status(200).send({ err: 0 });
	} else {
		e = error.unauthorized('Group already exist');
		return next(e);
	}

	debug('This is the create group route');

	next();
});

module.exports.privateRoutes = privateApp;