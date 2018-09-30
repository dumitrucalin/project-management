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
	var taskName = req.body.taskName;
	var taskString = req.body.taskString;
	var taskPriority = req.body.taskPriority;

	var taskId = await db.task.createTask(taskName, taskString, taskPriority);

	await db.group.setTasksGiven(groupName, usernameCreator, taskId);
	await db.group.setTasksReceived(groupName, usernameReceiver, taskId);
	res.status(200).send({ err: 0 });
});

privateApp.post('/get', async function(req, res) {
	var groupName = req.body.groupName;
	var username = req.body.username;

	var tasksId = await db.group.findTasks(groupName, username);

	var tasks = {
		tasksGiven: [],
		tasksReceived: []
	};

	for (let taskId of tasksId.tasksGiven) {
		let task = await db.task.findByTaskId(taskId);
		tasks.tasksGiven.push(task);
	}

	for (let taskId of tasksId.tasksReceived) {
		let task = await db.task.findByTaskId(taskId);
		tasks.tasksReceived.push(task);
	}

	res.status(200).send({ err: 0, tasks: tasks });
});

privateApp.post('/delete', async function(req, res) {
	var taskId = req.body.taskId;
	var existTask = await db.task.findByTaskId(taskId);
	if (existTask) {
		try {
			await db.task.deleteTask(taskId);
			res.status(200).send({err:0});
		} catch (err) {
			debug(err.message);
		}
	} else {
		debug('There is no task with that id');
	}
});

module.exports.privateRoutes = privateApp;