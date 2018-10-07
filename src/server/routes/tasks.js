'use strict';

var express = require('express');
var debug = require('debug')('task-manager:user-routes');
var db = require('../database/database.js');

var privateApp = express.Router();

debug.log = console.info.bind(console);

privateApp.post('/create', async function(req, res) {
	var usernameCreator = req.body.usernameCreator;
	var usernameReceiver = req.body.usernameReceiver;
	var groupName = req.body.groupName;

	var group = await db.group.findByGroupName(groupName);
	if (group) {
		var user = await db.user.findByUsername(usernameReceiver);
		if (user) {
			var taskId = await db.task.createTask(req.body);

			if (usernameCreator === usernameReceiver) {
				await db.group.setTasksReceived(groupName, usernameReceiver, taskId);
				await db.group.setTasksStatus(groupName, usernameReceiver, true);
				debug('User ' + usernameReceiver + ' tasks list updated');
			} else {
				await db.group.setTasksGiven(groupName, usernameCreator, taskId);
				await db.group.setTasksReceived(groupName, usernameReceiver, taskId);
				await db.group.setTasksStatus(groupName, usernameCreator, true);
				await db.group.setTasksStatus(groupName, usernameReceiver, true);
				debug('Users tasks list updated');
			}

			return res.status(200).send({ err: 0 });
		} else {
			debug('The user ' + usernameReceiver + ' doesn\'t exist');
			return res.status(200).send({ err: 1, message: 'The user ' + usernameReceiver + ' doesn\'t exist!' });
		}
	} else {
		debug('The group ' + groupName + 'doesn\'t exist');
		return res.status(200).send({ err: 1, message: 'The group ' + groupName + 'doesn\'t exist!' });
	}
});

privateApp.post('/get', async function(req, res) {
	var groupName = req.body.groupName;
	var username = req.body.username;

	var group = await db.group.findByGroupName(groupName);
	if (group) {
		var user = await db.user.findByUsername(username);
		if (user) {
			debug('Getting the tasks list from the user ' + username + ' in the group ' + groupName);
			var tasksId = await db.group.findTasks(groupName, username);
		
			var tasks = {
				tasksGiven: [],
				tasksReceived: []
			};
		
			for (let taskId of tasksId.tasksGiven) {
				let task = await db.task.findByTaskId(taskId);
				if (task) {
					tasks.tasksGiven.push(task);
				} else {
					await db.group.deleteTaskGiven(groupName, username, taskId);
				}
			}
			debug('Given tasks got successfully');
		
			for (let taskId of tasksId.tasksReceived) {
				let task = await db.task.findByTaskId(taskId);
				if (task) {
					tasks.tasksReceived.push(task);
				} else {
					await db.group.deleteTaskReceived(groupName, username, taskId);
				}
			}
			debug('Received tasks got successfully');

			await db.group.setTasksStatus(groupName, username, false);
			return res.status(200).send({ err: 0, tasks: tasks });
		} else {
			debug('The user ' + username + ' doesn\'t exist');
			return res.status(200).send({ err: 1, message: 'The user ' + username + ' doesn\'t exist!' });
		}
	} else {
		debug('The group ' + groupName + ' doesn\'t exist');
		return res.status(200).send({ err: 1, message: 'The group ' + groupName + ' doesn\'t exist!' });
	}
});

privateApp.post('/status/get', async function(req, res) {
	var groupName = req.body.groupName;
	var username = req.body.username;

	var group = await db.group.findByGroupName(groupName);
	if (group) {
		var user = await db.user.findByUsername(username);
		if (user) {
			let tasksModified = group.users[username].tasksModified;
			return res.status(200).send({ err: 0, tasksModified: tasksModified });
		} else {
			debug('The user ' + username + ' doesn\'t exist');
			return res.status(200).send({ err: 1, message: 'The user ' + username + ' doesn\'t exist!' });
		}
	} else {
		debug('The group ' + groupName + ' doesn\'t exist');
		return res.status(200).send({ err: 1, message: 'The group ' + groupName + ' doesn\'t exist!' });
	}
});

privateApp.post('/delete', async function(req, res) {
	var taskId = req.body.taskId;
	var groupName = req.body.groupName;

	var group = await db.group.findByGroupName(groupName);
	if (group) {
		var task = await db.task.findByTaskId(taskId);
		if (task) {
			await db.task.deleteTask(taskId);
			await db.group.setTasksStatus(groupName, task.usernameCreator, true);
			await db.group.setTasksStatus(groupName, task.usernameReceiver, true);
			debug('Task deleted');
			return res.status(200).send({ err:0 });
		} else {
			debug('There is no task with that id');
			return res.status(200).send({ err: 1, message: 'The task with the given ID doesn\'t exist!' });
		}
	} else {
		debug('The group ' + groupName + ' doesn\'t exist');
		return res.status(200).send({ err: 1, message: 'The group ' + groupName + ' doesn\'t exist!' });
	}
});

privateApp.post('/exist', async function(req, res) {
	var taskId = req.body.taskId;
	var task = await db.task.findByTaskId(taskId);
	if (task) {
		return res.status(200).send({ err: 0 });
	} else {
		debug('The task with the given taskId doesn\'t exist');
		return res.status(200).send({ err: 1, message: 'THe task with the given taskId doesn\' exist!' });
	}
});

privateApp.post('/change/status', async function(req, res) {
	var taskId = req.body.taskId;
	var taskStatus = req.body.taskStatus;
	var groupName = req.body.groupName;
	var usernameReceiver = req.body.usernameReceiver;
	var usernameCreator = req.body.usernameCreator;

	var task = await db.task.changeTaskStatus(taskId, taskStatus);
	if (task) {
		await db.group.setTasksStatus(groupName, usernameCreator, true);
		await db.group.setTasksStatus(groupName, usernameReceiver, true);
		return res.status(200).send({ err: 0 });
	} else {
		debug('The task with the given taskId doesn\'t exist');
		return res.status(200).send({ err: 1, message: 'THe task with the given taskId doesn\' exist!' });
	}
});

module.exports.privateRoutes = privateApp;