var mongoose = require('mongoose');
var uuid = require('uuid');
var _ = require('lodash');

var taskSchema = mongoose.Schema({
	taskId: {
		type: String,
		unique: true,
		required: true
	},
	taskName: {
		type: String,
		required: true
	},
	taskString: {
		type: String,
		required: true
	},
	taskDeadline: {
		type: Date
	},
	taskStatus: {
		type: String
	},
	taskPriority: {
		type: String, 
		required: true
	},
	usernameReceiver: {
		type: String,
		required: true
	},
	usernameCreator: {
		type: String,
		required: true
	}
}, {
	toObject: {
		transform: function(doc, ret) {
			delete ret.__v;
		}
	},
	toJSON: {
		transform: function(doc, ret) {
			delete ret.__v;
		}
	}
});

var Task = mongoose.model('Task', taskSchema);

function createTaskId() {
	return uuid.v4() + uuid.v4() + uuid.v4() + uuid.v4();
}

function createTask(taskName, taskString, taskPriority, usernameCreator, usernameReceiver) {
	var taskId = createTaskId();
	
	var task = new Task(_.assign({}, {
		taskId: taskId,
		taskName: taskName,
		taskString: taskString,
		taskPriority: taskPriority,
		usernameReceiver: usernameReceiver,
		usernameCreator: usernameCreator
	}));

	task.save();
	return taskId;
}

function findByTaskId(taskId) {
	return Task.findOne({ taskId: taskId });
}

function deleteTask(taskId) {
	return Task.deleteOne({ taskId: taskId });
}

var task = {
	createTask,
	findByTaskId,
	deleteTask
};

module.exports = task;