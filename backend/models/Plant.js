const mongoose = require('mongoose');
const PlantPost = require('./PlantPost');

const plantSchema = new mongoose.Schema({
	plantName: {
		type: String,
		required: true,
		min: 1,
		max: 255
	},
	latinName: {
		type: String,
		min: 1,
		max: 255
	},
	image: {
		type: String,
	},
	plantPosts: [
		PlantPost
	],
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = plantSchema;