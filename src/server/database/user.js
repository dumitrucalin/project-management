var mongoose = require('mongoose');
var crypto = require('crypto');
var _ = require('lodash');

var userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		unique: true
	},
	token: {
		type: String,
		required: true
	},
	fullName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	groupNames: {
		type: [String],
		required: true
	}
}, {
	toObject: {
		transform: function(doc, ret) {
			delete ret.password;
			delete ret.__v;
		}
	},
	toJSON: {
		transform: function(doc, ret) {
			delete ret.password;
			delete ret.__v;
		}
	}
});


function encryptPassword(password, salt) {
	if (!salt) {
		salt = '';
	}
	return crypto.createHash('sha256').update(password + salt).digest('base64');
}

var User = mongoose.model('User', userSchema);

function createUser(username, password, fullName, email, token, groupNames) {
	var user = new User(_.assign({}, {
		username: username,
		password: encryptPassword(password),
		fullName: fullName,
		email: email,
		token: token,
		groupNames: groupNames
	}));

	return user.save();
}

function findByUsername(username) {
	return User.findOne({ username: username });
}

function findByUsernameAndPassword(username, password) {
	return User.findOne({ username: username, password: encryptPassword(password)});
}

function findByEmail(email) {
	return User.findOne({ email: email });
}

function findByToken(token) {
	return User.findOne({ token: token });
}

function deleteByUsername(username) {
	return User.remove({ username });
}

function listUsers() {
	return User.find();
}

function edit(username, email, fullName) {
	var updatedUser = {};
	if (email) {
		updatedUser.email = email;
	}
	if (fullName) {
		updatedUser.fullName = fullName;
	}
	return User.updateOne({ username: username }, { $set: updatedUser });
}

function setPassword(username, password) {
	return User.updateOne({ username: username }, { $set: { password: encryptPassword(password) } });
}

function editPassword(username, oldPassword, newPassword) {
	return User.updateOne({ username: username, password: encryptPassword(oldPassword) }, { $set: { password: encryptPassword(newPassword) } });
}

function resetPassword(username, password) {
	return User.updateOne({ username: username }, { $set: { password: encryptPassword(password) } });
}

function setToken(username, token) {
	return User.updateOne({ username: username }, { $set: { token: token } });
}

function updateGroups(username, groupName) {
	return User.updateOne({ username: username }, { $addToSet: { groupNames: groupName } });
}

function deleteGroup(username, groupName) {
	return User.updateOne({ username: username}, { $pull: { groupNames: groupName } });
}

var user = {
	createUser,
	findByUsername,
	findByUsernameAndPassword,
	findByEmail,
	findByToken,
	deleteByUsername,
	edit,
	editPassword,
	setPassword,
	resetPassword,
	listUsers,
	setToken,
	updateGroups,
	deleteGroup
};

module.exports = user;