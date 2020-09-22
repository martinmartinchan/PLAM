const mongoose = require('mongoose');
const Plant = require('./Plant')

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		min: 3,
		max: 255
	},
	/** A duplicate of the username is stored in lower case in order to find duplicates.
	 * This solution is chosen due to username being small and case insensitive searches are ineffective.
	*/
	usernameLowerCase: {
		type: String,
		required: true,
		min: 3,
		max: 255
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true,
		min:6,
		max: 1024
	},
	plants: [
		Plant
	],
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('User', userSchema);