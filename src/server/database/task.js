var mongoose = require('mongoose');
var _ = require('lodash');

var taskSchema = mongoose.Schema({
	taskId: {
		type: String,
		unique: true
	},
	taskName: {
		type: String
	},
	taskString: {
		type: String
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

function createTask(taskId, taskName, taskString) {
	var task = new Task(_.assign({}, {
		taskId: taskId,
		taskName: taskName,
		taskString: taskString
	}));

	return task.save();
}

function findByTaskId(taskId) {
	return Task.finOne({taskId: taskId});
}

function editTask(taskId, taskName, taskString) {
	var taskUpdated = {};

	if (taskName)
		taskUpdated.taskName = taskName;
	if (taskString)
		taskUpdated.taskString = taskString;

	return Task.updateOne({ taskId: taskId }, { $set: { taskUpdated } });
}

var task = {
	createTask,
	findByTaskId,
	editTask
};

module.exports = task;