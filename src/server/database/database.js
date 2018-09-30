'use strict';

var mongoose = require('mongoose');
var debug = require('debug')('task-manager:database');

debug.log = console.info.bind(console);

mongoose.set('debug', process.env.NODE_ENV !== 'production');

mongoose.Promise = global.Promise;

var database_string = process.env.TASK_MANAGER_MONGODB_RESOURCE;

if (database_string && database_string.trim().length > 0) {
	debug('Using Task-manager Database');
} else {
	debug('Using TASK_MANAGER_MONGODB');
	database_string = 'mongodb://' + process.env.TASK_MANAGER_MONGODB_USER + ':' + process.env.TASK_MANAGER_MONGODB_PASSWORD +
		'@' + process.env.TASK_MANAGER_MONGODB_SERVER + '/' + process.env.TASK_MANAGER_MONGODB_DATABASE;
	debug(database_string);
}

var db = mongoose.connection;

db.on('connecting', function() {
	debug('[MONGODB]:Connecting');
});

db.on('connected', function() {
	debug('[MONGODB]: Connected to database');
});

db.on('close', function() {
	debug('[MONGODB]: Connection closed');
});

db.on('error', function(error) {
	debug('[DATABASE]Error while connecting:' + error);
});

db.on('disconnected', function() {
	debug('[MONGODB]: Database disconnected');
});

try {
	mongoose.connect(database_string, {
		reconnectTries: 10,
		reconnectInterval: 3500,
		autoReconnect: true,
		keepAlive: 120,
		useNewUrlParser: true
	});
} catch (error) {
	debug('[MONGODB]: Error while connecting to database:' + error);
}

var user = require('./user.js');
var group = require('./group.js');
var task = require('./task.js');

module.exports.user = user;
module.exports.group = group;
module.exports.task = task;