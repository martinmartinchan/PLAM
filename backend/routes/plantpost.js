const router = require('express').Router();
const PlantPost = require('../models/PlantPost');
const authenticate = require('../middlewares/authentication');
const { countQueryValidation } = require('../middlewares/validation');
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
	return true;
}

/**
 * GET the 50 most recently posted plants
 * In: -
 * Out: Array[(Object) PlantPost]
 */
router.get('/latest', countQueryValidation, async (req, res) => {
	try {
		// If limit was passed in the query, set the limit
		const limit = req.hasCount ? Number(req.query.count) : null
		const plantposts = await PlantPost.find({}).sort({'date': -1}).limit(limit);

		return res.status(200).json(createResponse(true, plantposts, `Successfully retreived ${plantposts.length} plantpost(s)`));
	} catch(err) {
		return res.status(400).json(createResponse(false, {}, err.toString()));
	}
});

/**
 * POST
 * In: header.access_tolen, body.post { title (req), image, description }
 * Out: (Object) PlantPost
 */
router.post('/', authenticate, async (req, res) => {
	try {
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
		return res.json(createResponse(true, newPlantPost, `Successfully added new post with title ${req.body.post.title}`));
	} catch(err) {
		return res.status(400).json(createResponse(false, {}, err.toString()));
	}
});

module.exports = router;