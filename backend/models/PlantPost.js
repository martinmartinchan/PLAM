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
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	comments: [
		{type: String}
	],
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('PlantPost', plantPostSchema);;