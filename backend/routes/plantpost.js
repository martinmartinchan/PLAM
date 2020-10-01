const router = require('express').Router();
const PlantPost = require('../models/PlantPost');
const authenticate = require('../middlewares/authentication');
const { createResponse } = require('../misc/helper');

// Validates the necessary fields in a plant post
const validatePlantPost = function(post) {
	try {
		// Check that title exists and is not too long
		if (post.title.length < 1 || post.title.length > 255) {
			return false;
		}
	} catch {
		return false;
	}
}

// Post a new plant post to a users plant. Requires authentication
router.post('/', authenticate, async (req, res) => {
	if (!validatePlantPost(req.body.post)) {return res.status(400).json(createResponse(false, {}, 'Invalid post'))}

	const newPlantPost = new PlantPost();
	newPlantPost.title = req.body.post.title;
	if (req.body.post.hasOwnProperty('image')) {
		newPlantPost.image = req.body.post.image;
	};
	if (req.body.post.hasOwnProperty('description')) {
		newPlantPost.description = req.body.post.description;
	}
	newPlantPost.owner = req.body.client_id;

	await newPlantPost.save();
	return res.json(createResponse(true, newPlantPost, `Successfully added new post with title ${req.body.post.title} to plant ${user.plants[plantIndex].plantName}`));
});

module.exports = router;