const mongoose = require('mongoose');

const plantPostSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		min: 1,
		max: 255
	},
	image: {
		type: String,
		min: 1,
		max: 255
	},
	description: {
		type: String
	},
	comments: [
		{type: String}
	]
	,
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = plantPostSchema;