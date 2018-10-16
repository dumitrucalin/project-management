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
		type: Date,
	},
	taskPriority: {
		type: String, 
	},
	taskStatus: {
		type: String,
		required: true
	},
	usernamesReceiver: {
		type: [String],
		required: true
	},
	usernameCreator: {
		type: String,
		required: true
	},
	viewers: {
		type: [String],
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

function createTask(taskInfo) {
	var taskId = createTaskId();
	taskInfo.taskId = taskId;

	var task = new Task(_.assign({}, taskInfo));
	task.save();

	return taskId;
}

function findByTaskId(taskId) {
	return Task.findOne({ taskId: taskId });
}

function setTaskReceiver(taskId, usernamesReceiver) {
	return Task.updateOne({ taskId: taskId }, { usernamesReceiver: usernamesReceiver });
}

function deleteTask(taskId) {
	return Task.deleteOne({ taskId: taskId });
}

function changeTaskStatus(taskId, taskStatus) {
	return Task.updateOne({ taskId: taskId }, { $set: { taskStatus: taskStatus } });
}

function deleteViewer(taskId, username) {
	return Task.updateOne({ taskId: taskId }, { $pull: { viewers: username } });
}

var task = {
	createTask,
	findByTaskId,
	setTaskReceiver,
	deleteTask,
	changeTaskStatus,
	deleteViewer
};

module.exports = task;