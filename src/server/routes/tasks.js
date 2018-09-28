'use strict';

var express = require('express');
var debug = require('debug')('task-manager:user-routes');
var uuid = require('uuid');
var db = require('../database/database.js');

var privateApp = express.Router();

debug.log = console.info.bind(console);

function createTaskId() {
	return uuid.v4() + uuid.v4() + uuid.v4() + uuid.v4();
}

privateApp.post('/create', async function(req, res) {
	var taskId = createTaskId();
	var taskName = req.body.taskName;
	var taskString = req.body.taskString;

	try {
		await db.task.createTask(taskId, taskName, taskString);
		res.status(200).send({err: 0});
	} catch (err) {
		debug(err.message);
	}

	return taskId;
});

privateApp.post('/edit', async function(req, res) {
	var taskId = req.body.taskId;
	var taskName = req.body.taskName;
	var taskString = req.body.taskString;

	try {
		await db.task.editTask(taskId, taskName, taskString);
		res.status(200).send({err: 0});
	} catch (err) {
		debug(err.message);
	}
});

module.exports.privateRoutes = privateApp;