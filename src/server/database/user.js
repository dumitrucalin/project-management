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

async function edit(username, email, fullName) {
	var userUpdated = {};
	if (email) {
		userUpdated.email = email;
	}
	if (fullName) {
		userUpdated.fullName = fullName;
	}
	let ret = await User.updateOne({ username: username }, { $set: userUpdated });
	return ret;
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
	return User.updateOne({ username: username }, { $addToSet: { groupName: groupName } });
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
	updateGroups
};

module.exports = user;