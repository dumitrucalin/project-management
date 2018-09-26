var mongoose = require('mongoose');
var _ = require('lodash');

var groupSchema = mongoose.Schema({
	groupName: {
		type: String,
		required: true,
		unique: true,
	},
	users: {
	},
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

function create(groupName) {
	var group = new Group(_.assign({}, {
		groupName: groupName,
		users: null
	}));

	return group.save();
}

function findByGroupName(groupName) {
	return Group.findOne({ groupName: groupName }).lean();
}

function updateUsers(groupName, users) {
	console.log(groupName);
	for (let user in users) {
		console.log(user);
		// return Group.update({ groupName: groupName}, { $set: { [user]: { tasksGiven: [], taskReceived: [] } } });
	}
}


var group = {
	create,
	findByGroupName,
	updateUsers
};

module.exports =group;