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
		await db.group.createGroup(groupName, usernames);

		for (let username of usernames) {
			debug('Searching for user ' + username);
			let userFound = await db.user.findByUsername(username);

			if (userFound) {
				debug('Updating groups list');
				await db.user.updateGroups(username, groupName);
			} else {
				debug('The given user ' + username + ' doesn\'t eixst');
			}
		}

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

		for (let username of usernames) {
			debug('Searching for user ' + username);
			let userFound = await db.user.findByUsername(username);

			if (userFound) {
				debug('Updating groups list');
				await db.user.updateGroups(username, groupName);
			} else {
				debug('The given user ' + username + ' doesn\'t eixst');
			}
		}

		res.status(200).send({err: 0});
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
		debug('Deleting the given user');
		await db.group.deleteUsers(groupName, username);
		await db.user.deleteGroup(username, groupName);
		res.status(200).send({ err: 0 });
	} else {
		debug('The group doesn\'t exist');
	}
});

module.exports.privateRoutes = privateApp;