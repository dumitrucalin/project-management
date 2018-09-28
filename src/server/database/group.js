var mongoose = require('mongoose');
var _ = require('lodash');

var groupSchema = mongoose.Schema({
	groupName: {
		type: String,
		required: true,
		unique: true,
	},
	users: [
		{
			username: {
				type: String
			},
			tasksGiven: {
				type: [String],
			},
			tasksReceived: {
				type: [String],
			}
		}
	]
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

function create(groupName, usernames) {
	var users = [];

	usernames.forEach(username => {
		var user = {
			username: username,
		};

		users.push(user);
	});

	var group = new Group(_.assign({}, {
		groupName: groupName,
		users: users
	}));

	return group.save();
}

function findByGroupName(groupName) {
	return Group.findOne({ groupName: groupName });
}

function updateUsers(groupName, usernames) {
	var users = [];

	usernames.forEach(username => {
		var user = {
			username: username,
		};

		users.push(user);
	});

	return Group.updateOne({ groupName: groupName }, { users: users });
}

async function setTaskGiven(groupName, username, taskId) {
	console.log(taskId);
	var group = await Group.findOne({ groupName: groupName});
	var user = group.users.find(obj => {
		return obj.username === username;
	});
	console.log(user);
	return;
}


var group = {
	create,
	findByGroupName,
	updateUsers,
	setTaskGiven
};

module.exports = group;