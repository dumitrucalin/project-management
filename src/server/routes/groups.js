'use strict';

var express = require('express');
var debug = require('debug')('task-manager:user-routes');
var db = require('../database/database.js');
// var error = require('../error.js');

var privateApp = express.Router();

debug.log = console.info.bind(console);

privateApp.post('/create', async function(req, res) {
	var groupName = req.body.groupName;
	var usernames = req.body.usernames;
	debug('Searching for group ' + groupName);
	var group = await db.group.findByGroupName(groupName);
	if (!group) {
		await db.group.createGroup(groupName, usernames);
		res.status(200).send({ err: 0 });
	} else {
		debug('The group already exists');
	}
});

privateApp.post('/delete', async function(req, res) {
	var groupName = req.body.groupName;
	debug('Searching for the group');
	var group = await db.group.findByGroupName(groupName);
	if (group) {
		await db.group.deleteGroup(groupName);
		res.status(200).send({err: 0});
	} else {
		debug('The group doesn\'t exist');
	}
});

privateApp.post('/users/create', async function (req, res) {
	var groupName = req.body.groupName;
	var usernames = req.body.usernames;
	debug('Searching for group ' + groupName);
	var group = await db.group.findByGroupName(groupName);
	if (group) {
		await db.group.createUsers(groupName, usernames);
		res.status(200).send({ err: 0 });
	} else {
		debug('The group doesn\'t exist');
	}
});

privateApp.post('/users/delete', async function (req, res) {
	var groupName = req.body.groupName;
	var username = req.body.username;
	debug('Searching for group ' + groupName);
	var group = await db.group.findByGroupName(groupName);
	if (group) {
		await db.group.deleteUsers(groupName, username);
		res.status(200).send({ err: 0 });
	} else {
		debug('The group doesn\'t exist');
	}
});

privateApp.post('/tasks/given/set', async function(req, res) {
	var taskId = req.body.taskId;
	var groupName = req.body.groupName;
	var username = req.body.username;
	await db.group.setTasksGiven(groupName, username, taskId);
	res.status(200).send({ err: 0 });
});

privateApp.post('/tasks/received/set', async function(req, res) {
	var taskId = req.body.taskId;
	var groupName = req.body.groupName;
	var username = req.body.username;
	await db.group.setTasksReceived(groupName, username, taskId);
	res.status(200).send({ err: 0 });
});

module.exports.privateRoutes = privateApp;