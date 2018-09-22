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
		unique: true
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

userSchema.pre('save', function(next) {
	var user = this;
	if (user.isModified('password')) {
		user.password = encryptPassword(user.password);
	}
	next();
});

var User = mongoose.model('User', userSchema);
/**
 * Create a new user
 * @param {String} username - username 
 * @param {String} password - password
 * @param {String} email - email
 */
function create(username, password, email, token) {
	var user = new User(_.assign({}, {
		username: username,
		password: password,
		email: email,
		token: token
	}));

	return user.save();
}

function findByUsername(username) {
	return User.findOne({ username: username }).lean();
}

function findByEmail(email) {
	return User.findOne({ email: email }).lean();
}

function findByToken(token) {
	return User.findOne({ token: token }).lean();
}

function deleteByUsername(username) {
	return User.remove({ username });
}

function listUsers() {
	return User.find().lean();
}


/**
 * Edit an user
 * @param {String} username - new first name (optional)
 * @param {String} password - new last name (optional)
 * @param {String} email - new email (optional)
 */

async function edit(username, password, email) {
	var editUser = {};
	if (username) {
		editUser.username = username;
	}
	if (password) {
		editUser.password = encryptPassword(password);
	}
	if (email) {
		editUser.email = email;
	}
	let ret = await User.updateOne({ username: username }, { $set: editUser }).lean();
	return ret;
}

function setPassword(username, password) {
	return User.updateOne({ username: username }, { $set: { password: encryptPassword(password) } });
}

// /**
//  * Edit password
//  * @param {String} userId 
//  * @param {String} oldPassword - old password 
//  * @param {String} newPassword - new password
//  */
// function editPassword(userId, oldPassword, newPassword) {
// 	return User.updateOne({ userId: userId, password: encryptPassword(oldPassword) }, { $set: { password: encryptPassword(newPassword) } });
// }

/**
 * Reset a password
 * @param {String} userId 
 * @param {String} password - new password
 */
function resetPassword(username, password) {
	return User.updateOne({ username: username }, { $set: { password: encryptPassword(password) } });
}

function setToken(username, token) {
	return User.updateOne({ username: username }, { $set: { token: token } });
}

var user = {
	create,
	findByUsername,
	findByEmail,
	findByToken,
	deleteByUsername,
	edit,
	setPassword,
	// editPassword,
	resetPassword,
	listUsers,
	setToken
};

module.exports = user;