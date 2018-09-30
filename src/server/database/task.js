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
	deadline: {
		type: Date,
		required: true
	},
	priority: {
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

function createTask(taskName, taskString) {
	var taskId = createTaskId();
	var task = new Task(_.assign({}, {
		taskId: taskId,
		taskName: taskName,
		taskString: taskString
	}));

	task.save();
	return taskId;
}

function findByTaskId(taskId) {
	return Task.findOne({ taskId: taskId });
}

function editTask(taskId, taskName, taskString) {
	var taskUpdated = {};

	if (taskName)
		taskUpdated.taskName = taskName;
	if (taskString)
		taskUpdated.taskString = taskString;

	return Task.updateOne({ taskId: taskId }, { $set: { taskUpdated } });
}

function deleteTask(taskId) {
	return Task.deleteOne({ taskId: taskId });
}

var task = {
	createTask,
	findByTaskId,
	editTask,
	deleteTask
};

module.exports = task;