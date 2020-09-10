const router = require('express').Router();
const User = require('../models/User');
const authenticate = require('../middlewares/authentication');

// Post a new plant post to a users plant. Requires authentication
router.post('/', authenticate, async (req, res) => {
	// Get the user id set by authentication middleware and find user
	const user_id = req.body.client_id;
	const user = await User.findOne({_id: user_id});

	// Iterate through user to check for plant with the given ID. Also save the index of the plant
	const plantIndex = user.plants.findIndex(plant => {
		return plant._id == req.body.plant_id;
	});

	// If found, add the new post to the plant
	if (plantIndex >= 0) {
		user.plants[plantIndex].plantPosts.push(req.body.post);
		const savedUser = await user.save();

		// Send appropriate respond
		return res.json({
			post: req.body.post,
			message: `Successfully added new post with title ${req.body.post.title} to plant ${user.plants[plantIndex].plantName}`
		})
	} else {
		return res.status(400).json({ message: `Plant with ID ${req.body.plant_id} does not belong to ${user.username}`});
	}
});

module.exports = router;