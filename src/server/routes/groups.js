'use strict';

var express = require('express');
var debug = require('debug')('task-manager:user-routes');
var db = require('../database/database.js');

var privateApp = express.Router();

debug.log = console.info.bind(console);

privateApp.post('/create', async function(req, res) {
	var groupName = req.body.groupName;
	var usernames = req.body.usernames;

	debug('Searching for group ' + groupName);
	var group = await db.group.findByGroupName(groupName);

	if (!group) {
		for (let username of usernames) {
			debug('Searching for user ' + username);
			let userFound = await db.user.findByUsername(username);

			if (!userFound) {
				debug('The user ' + username + ' doesn\'t exist');
				return res.status(200).send({ err: 1, message: 'The user ' + username + ' doesn\'t exist!' });
			}
		}
		debug('All given users founded');

		await db.group.createGroup(groupName, usernames);
		for (let username of usernames) {
			await db.user.updateGroups(username, groupName);
		}
		debug('The users were added to the group');
		return res.status(200).send({ err: 0 });
	} else {
		debug('The group ' + groupName + ' already exists');
		return res.status(200).send({ err: 1, message: 'The group ' + groupName + ' already exist!' });
	}
});

privateApp.post('/delete', async function(req, res) {
	var groupName = req.body.groupName;

	debug('Searching for the group ' + groupName);
	var group = await db.group.findByGroupName(groupName);

	if (group) {
		var usernames = Object.keys(group.users);
		for (let username in usernames) {
			var tasks = group.users[username];
			for (let taskId of tasks.tasksGiven) {
				await db.task.deleteTask(taskId);
			}
			for (let taskId of tasks.tasksReceived) {
				await db.task.deleteTask(taskId);
			}
			await db.user.deleteGroup(username, groupName);
		}
		await db.group.deleteGroup(groupName);
		debug('Group ' + groupName + ' deleted');
		return res.status(200).send({err: 0});
	} else {
		debug('The group ' + groupName + ' doesn\'t exist');
		return res.status(200).send({ err: 1, message: 'The group ' + groupName  + 'already exist!' });
	}
});

privateApp.post('/users/create', async function (req, res) {
	var groupName = req.body.groupName;
	var usernames = req.body.usernames;

	debug('Searching for group ' + groupName);
	var group = await db.group.findByGroupName(groupName);

	if (group) {
		for (let username of usernames) {
			debug('Searching for user ' + username);
			let userFound = await db.user.findByUsername(username);

			if (!userFound) {
				debug('The user ' + username + ' doesn\'t exist');
				return res.status(200).send({ err: 1, message: 'The user ' + username + ' doesn\'t exist!' });
			}
		}
		debug('All given users found');

		await db.group.createUsers(groupName, usernames);
		for (let username of usernames) {
			await db.user.updateGroups(username, groupName);
		}
		debug('The users were added to the group');

		return res.status(200).send({ err: 0 });
	} else {
		debug('The group ' + groupName + ' doesn\'t exist');
		return res.status(200).send({ err: 1, message: 'The group ' + groupName + ' doesn\'t exist!' });
	}
});

privateApp.post('/user/delete', async function (req, res) {
	var groupName = req.body.groupName;
	var username = req.body.username;

	debug('Searching for group ' + groupName);
	var group = await db.group.findByGroupName(groupName);

	if (group) {
		debug('Searching for user ' + username);
		var user = await db.user.findByUsername(username);

		if (user) {
			var tasks = group.users[username];
			for (let taskId of tasks.tasksGiven) {
				await db.task.deleteTask(taskId);
			}
			for (let taskId of tasks.tasksReceived) {
				await db.task.deleteTask(taskId);
			}
			await db.group.deleteUser(groupName, username);
			await db.user.deleteGroup(username, groupName);
			if (Object.keys(group.users).length === 0) {
				await db.group.deleteGroup(groupName);
			}
			debug('The user ' + username + ' was deleted from the group ' + groupName);
			return res.status(200).send({ err: 0 });
		} else {
			debug('The user ' + username + ' doesn\'t exist');
			return res.status(200).send({ err: 1, message: 'The user ' + username + ' doesn\'t exist!' });
		}
	} else {
		debug('The group ' + groupName + ' doesn\'t exist');
		return res.status(200).send({ err: 1, message: 'The group ' + groupName + ' doesn\'t exist!' });
	}
});

privateApp.post('/users/get', async function (req, res) {
	var groupName = req.body.groupName;

	var group = await db.group.findUsers(groupName);
	if (group) {
		var usernames = Object.keys(group.users);
		return res.status(200).send({ err: 0, usernames: usernames });
	} else {
		debug('The group ' + groupName + ' doesn\'t exist');
		return res.status(200).send({ err: 1, message: 'The group ' + groupName + ' doesn\'t exist!' });
	}
});

module.exports.privateRoutes = privateApp;