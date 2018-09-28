'use strict';

var express = require('express');
var debug = require('debug')('task-manager:user-routes');
var db = require('../database/database.js');
var error = require('../error.js');

var privateApp = express.Router();

debug.log = console.info.bind(console);

privateApp.post('/create', async function(req, res, next) {
	var e;
	var groupName = req.body.groupName;
	var usernames = req.body.usernames;
	debug('Searching for group ' + groupName);
	var group = await db.group.findByGroupName(groupName);
	if (!group) {
		await db.group.create(groupName, usernames);
		res.status(200).send({ err: 0 });
	} else {
		e = error.unauthorized('Group already exist');
		return next(e);
	}
});

privateApp.post('/users/update', async function (req, res, next) {
	var e;
	var groupName = req.body.groupName;
	var usernames = req.body.usernames;
	debug('Searching for group ' + groupName);
	var group = await db.group.findByGroupName(groupName);
	if (group) {
		await db.group.updateUsers(groupName, usernames);
		res.status(200).send({ err: 0 });
	} else {
		e = error.unauthorized('Group doesn\'t exist');
		return next(e);
	}
	return;
});

privateApp.post('/tasks/given/set', async function(req, res) {
	var taskId = req.body.taskId;
	var groupName = req.body.groupName;
	var username = req.body.username;
	await db.group.setTasksGiven(groupName, username, taskId);
	res.status(200).send({ err: 0 });
	return;
});

privateApp.post('/tasks/received/set', async function(req, res) {
	var taskId = req.body.taskId;
	var groupName = req.body.groupName;
	var username = req.body.username;
	await db.group.setTasksReceived(groupName, username, taskId);
	res.status(200).send({ err: 0 });
	return;
});

module.exports.privateRoutes = privateApp;