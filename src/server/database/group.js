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
			tasksReceived: []
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

function createUsers(groupName, usernames) {
	var updatedUsers = {};

	for (let username of usernames)
	{
		updatedUsers['users.' + username] = {
			tasksGiven: [],
			tasksReceived: []
		};
	}

	return Group.updateOne({ groupName: groupName }, { $set: updatedUsers } );
}

function deleteUsers(groupName, usernames) {
	console.log(groupName);
	console.log(usernames);
	return;
}

async function setTasksGiven(groupName, username, taskId) {
	var group = await Group.findOne({ groupName: groupName });
	var tasksGiven = group.users[username].tasksGiven;
	tasksGiven.push(taskId);
	var tasksReceived = group.users[username].tasksReceived;

	var updatedUsers = {};
	updatedUsers['users.' + username] = {
		tasksGiven: tasksGiven,
		tasksReceived: tasksReceived
	};

	return Group.updateOne({ groupName: groupName }, { $set: updatedUsers });
}

async function setTasksReceived(groupName, username, taskId) {
	var group = await Group.findOne({ groupName: groupName });
	var tasksGiven = group.users[username].tasksGiven;
	var tasksReceived = group.users[username].tasksReceived;
	tasksReceived.push(taskId);

	var updatedUsers = {};
	updatedUsers['users.' + username] = {
		tasksGiven: tasksGiven,
		tasksReceived: tasksReceived
	};

	return Group.updateOne({ groupName: groupName }, { $set: updatedUsers });
}


var group = {
	createGroup,
	deleteGroup,
	findByGroupName,
	createUsers,
	deleteUsers,
	setTasksGiven,
	setTasksReceived
};

module.exports = group;