'use strict';

var express = require('express');
var debug = require('debug')('task-manager:user-routes');
var db = require('../database/database.js');

var privateApp = express.Router();

debug.log = console.info.bind(console);

privateApp.post('/create', async function(req, res) {
	try {
		var groupName = req.body.groupName;
		var usernames = req.body.usernames;

		if (typeof usernames === 'string') {
			usernames = usernames.replace('[', '');
			usernames = usernames.replace(']', '');
			usernames = usernames.split(', ');
		}

		var group = await db.group.findByGroupName(groupName);
		if (!group) {
			for (let username of usernames) {
				let userFound = await db.user.findByUsername(username);

				if (!userFound) {
					debug('The user ' + username + ' doesn\'t exist');
					return res.status(200).send({ err: 1, message: 'The user ' + username + ' doesn\'t exist!' });
				}
			}

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
	} catch(e) {
		debug('Server error');
		return res.status(400).send({ err: 1, message: 'Server error!\n' + e });
	}
});

privateApp.post('/delete', async function(req, res) {
	try {
		var groupName = req.body.groupName;

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
	} catch(e) {
		debug('Server error');
		return res.status(400).send({ err: 1, message: 'Server error!\n' + e });
	}
});

privateApp.post('/users/create', async function (req, res) {
	try {
		var groupName = req.body.groupName;
		var usernames = req.body.usernames;

		if (typeof usernames === 'string') {
			usernames = usernames.replace('[', '');
			usernames = usernames.replace(']', '');
			usernames = usernames.split(', ');
		}

		var group = await db.group.findByGroupName(groupName);
		if (group) {
			for (let username of usernames) {
				let userFound = await db.user.findByUsername(username);

				if (!userFound) {
					debug('The user ' + username + ' doesn\'t exist');
					return res.status(200).send({ err: 1, message: 'The user ' + username + ' doesn\'t exist!' });
				}
			}

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
	} catch(e) {
		debug('Server error');
		return res.status(400).send({ err: 1, message: 'Server error!\n' + e });
	}
});

privateApp.post('/user/delete', async function (req, res) {
	try {
		var groupName = req.body.groupName;
		var username = req.body.username;

		var group = await db.group.findByGroupName(groupName);
		if (group) {
			var user = await db.user.findByUsername(username);
			if (user) {
				var tasksId = group.users[username];

				for (let taskId of tasksId.tasksGiven) {
					await db.task.changeTaskStatus(taskId, 'Deleted');
					await db.task.deleteViewer(taskId, username);
					let task = await db.task.findByTaskId(taskId);

					for (let username of task.viewers) {
						await db.group.setTasksStatus(groupName, username, true);
					}
				}
				for (let taskId of tasksId.tasksReceived) {
					await db.task.deleteViewer(taskId, username);
					let task = await db.task.findByTaskId(taskId);
					var newUsers = [];

					for (let user of task.usernamesReceiver) {
						if (user !== username)
							newUsers.push(user);
					}

					await db.task.setTaskReceiver(taskId, newUsers);
					if (task.usernamesReceiver.length <= 1)
						await db.task.changeTaskStatus(taskId, 'Reassign');

					for (let username of task.viewers) {
						await db.group.setTasksStatus(groupName, username, true);
					}
				}

				if (Object.keys(group.users).length <= 1)
					await db.group.deleteGroup(groupName);

				await db.group.deleteUser(groupName, username);
				await db.user.deleteGroup(username, groupName);

				debug('The user ' + username + ' was deleted from the group ' + groupName);
				return res.status(200).send({ err: 0, tasksId: tasksId });
			} else {
				debug('The user ' + username + ' doesn\'t exist');
				return res.status(200).send({ err: 1, message: 'The user ' + username + ' doesn\'t exist!' });
			}
		} else {
			debug('The group ' + groupName + ' doesn\'t exist');
			return res.status(200).send({ err: 1, message: 'The group ' + groupName + ' doesn\'t exist!' });
		}
	} catch(e) {
		debug('Server error');
		return res.status(400).send({ err: 1, message: 'Server error!\n' + e });
	}
});

privateApp.post('/users/get', async function (req, res) {
	try {
		var groupName = req.body.groupName;

		var group = await db.group.findUsers(groupName);
		if (group) {
			var usernames = Object.keys(group.users);
			usernames = usernames.sort();
			debug('Got the users succesfully');
			return res.status(200).send({ err: 0, usernames: usernames });
		} else {
			debug('The group ' + groupName + ' doesn\'t exist');
			return res.status(200).send({ err: 1, message: 'The group ' + groupName + ' doesn\'t exist!' });
		}
	} catch(e) {
		debug('Server error');
		return res.status(400).send({ err: 1, message: 'Server error!\n' + e });
	}
});

privateApp.post('/task/delete', async function (req, res) {
	try {
		var taskId = req.body.taskId;
		var groupName = req.body.groupName;
		var username = req.body.username;

		var group = await db.group.findByGroupName(groupName);
		if (group) {
			await db.group.deleteTaskReceived(groupName, username, taskId);
			await db.group.deleteTaskGiven(groupName, username, taskId);
			await db.task.deleteViewer(taskId, username);

			var task = await db.task.findByTaskId(taskId);
			if (task.viewers.length === 0) {
				await db.task.deleteTask(taskId);
			}

			debug('The task was deleted');
			return res.status(200).send({ err: 0 });
		} else {
			debug('The group ' + groupName + ' doesn\'t exist');
			return res.status(200).send({ err: 1, message: 'The group ' + groupName + ' doesn\'t exist!' });
		}
	} catch(e) {
		debug('Server error');
		return res.status(400).send({ err: 1, message: 'Server error!\n' + e });
	}
});

module.exports.privateRoutes = privateApp;