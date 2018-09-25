var mongoose = require('mongoose');
var _ = require('lodash');

var groupSchema = mongoose.Schema({
	
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

function create(groupName, users) {
	var group = new Group(_.assign({}, {
		groupName: groupName,
		users: users
	}));

	return group.save();
}

function findByGroupName(groupName) {
	return Group.findOne({ groupName: groupName }).lean();
}


var group = {
	create,
	findByGroupName
};

module.exports =group;