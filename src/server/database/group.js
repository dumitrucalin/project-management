var mongoose = require('mongoose');
var _ = require('lodash');

var groupSchema = mongoose.Schema({
	groupName: {
		type: String,
		required: true,
		unique: true,
	},
	users: {}
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

var Group = mongoose.model('Group', groupSchema);

function createGroup(groupName, usernames) {
	var users = {};

	for (let username of usernames)
	{
		users[username] = {
			tasksGiven: [],
			tasksReceived: [],
			tasksModified: false
		};
	}

	var group = new Group(_.assign({}, {
		groupName: groupName,
		users: users
	}));

	return group.save();
}

function deleteGroup(groupName) {
	return Group.deleteOne({ groupName: groupName });
}

function findByGroupName(groupName) {
	return Group.findOne({ groupName: groupName });
}

async function findTasks(groupName, username) {
	var group = await Group.findOne({ groupName: groupName });
	return group.users[username];
}

function createUsers(groupName, usernames) {
	var updatedUsers = {};

	for (let username of usernames) {
		updatedUsers['users.' + username] = {
			tasksGiven: [],
			tasksReceived: [],
			tasksModified: false
		};
	}

	return Group.updateOne({ groupName: groupName }, { $set: updatedUsers });
}

function findUsers(groupName) {
	return Group.findOne({ groupName: groupName });
}

function deleteUser(groupName, username) {
	return Group.updateOne({ groupName: groupName }, { $unset: { ['users.' + username]: {} } });
}

function setTasksStatus(groupName, username, tasksStatus) {
	return Group.updateOne({ groupName: groupName }, { $set: { ['users.' + username + '.tasksModified']: tasksStatus } });
}

function setTasksGiven(groupName, username, taskId) {
	return Group.updateOne({ groupName: groupName }, { $addToSet: { ['users.' + username + '.tasksGiven']: taskId } });
}

function setTasksReceived(groupName, username, taskId) {
	return Group.updateOne({ groupName: groupName }, { $addToSet: { ['users.' + username + '.tasksReceived']: taskId } });
}

function deleteTaskGiven(groupName, username, taskId) {
	return Group.updateOne({ groupName: groupName }, { $pull: { ['users.' + username + '.tasksGiven']: taskId } });
}

function deleteTaskReceived(groupName, username, taskId) {
	return Group.updateOne({ groupName: groupName }, { $pull: { ['users.' + username + '.tasksReceived']: taskId } });
}


var group = {
	createGroup,
	deleteGroup,
	findByGroupName,
	findTasks,
	createUsers,
	findUsers,
	deleteUser,
	setTasksGiven,
	setTasksReceived,
	setTasksStatus,
	deleteTaskGiven,
	deleteTaskReceived
};

module.exports = group;