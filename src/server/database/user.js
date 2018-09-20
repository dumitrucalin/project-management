var mongoose = require('mongoose');
// var uuid = require('uuid');
var validator = require('validator');
var crypto = require('crypto');
var _ = require('lodash');

var userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: function(name) {
				return validator.isAlphanumeric(name) &&
					name.length >= 3 && name.length <= 20;
			}
		}
	},
	token: {
		type: String,
		unique: true
	},
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


userSchema.methods.fullName = function() {
	return this.firstName + ' ' + this.lastName;
};

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
 * @param {String} firstName - first name
 * @param {String} lastName - last name
 * @param {String} email - email
 */
function create(username, password, firstName, lastName, email, role) {
	var user = new User(_.assign({}, {
		username: username,
		password: password,
		firstName: firstName,
		lastName: lastName,
		email: email,
		role: role
	}));

	return user.save();
}

function findByUsername(username) {
	return User.findOne({ username: username }).lean();
}

function findByEmail(email) {
	return User.findOne({ email: email }).lean();
}

function findByUsernameAndPassword(username, password) {
	return User.findOne({ username: username, password: encryptPassword(password) }).lean();
}

function findByUserIdAndPassword(userId, password) {
	return User.findOne({ userId: userId, password: encryptPassword(password) }).lean();
}

function deleteByUserId(userId) {
	return User.remove({ userId });
}

function findByUserId(userId) {
	return User.findOne({ userId: userId }).lean();
}

function findUsers(partOfName) {
	var text = '^' + partOfName + '.*';
	return User.find({ username: { $regex: text } }).lean();
}

function listUsers() {
	return User.find().lean();
}

function findOneOrMoreByUserId(users) {
	return User.find({ userId: { $in: users } });
}



/**
 * Edit an user
 * @param {String} userId
 * @param {String} email - new email (optional)
 * @param {String} firstName - new first name (optional)
 * @param {String} lastName - new last name (optional)
 */

async function edit(userId, username, password, email, firstName, lastName, role) {
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
	if (firstName) {
		editUser.firstName = firstName;
	}
	if (lastName) {
		editUser.lastName = lastName;
	}
	if (role) {
		editUser.role = role;
	}
	let ret = await User.updateOne({ userId: userId }, { $set: editUser }).lean();
	return ret;
}

function setPassword(userId, password) {
	return User.updateOne({ userId: userId }, { $set: { password: encryptPassword(password) } });
}

/**
 * Edit password
 * @param {String} userId 
 * @param {String} oldPassword - old password 
 * @param {String} newPassword - new password
 */
function editPassword(userId, oldPassword, newPassword) {
	return User.updateOne({ userId: userId, password: encryptPassword(oldPassword) }, { $set: { password: encryptPassword(newPassword) } });
}

/**
 * Reset a password
 * @param {String} userId 
 * @param {String} password - new password
 */
function resetPassword(userId, password) {
	return User.updateOne({ userId: userId }, { $set: { password: encryptPassword(password) } });
}

var user = {
	create,
	findByUsername,
	findByEmail,
	deleteByUserId,
	findByUsernameAndPassword,
	findByUserId,
	findUsers,
	edit,
	setPassword,
	editPassword,
	findByUserIdAndPassword,
	resetPassword,
	listUsers,
	findOneOrMoreByUserId
};

module.exports = user;