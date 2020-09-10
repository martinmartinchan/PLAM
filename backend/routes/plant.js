const router = require('express').Router();
const User = require('../models/User');
const authenticate = require('../middlewares/authentication');
const { createResponse } = require('../misc/helper');
const { create } = require('../models/User');

/** Posts a new plant to a user. Requires authentication
 *
 * Input:
 * 		header: { access_token }
 * 		body: {
 * 			plantName String required,
 * 			latinName String,
 * 			image String,
 * 		}
 *
 * Returns:
 * 		{
 *      status boolean,
 * 			result plantObject,
 * 			message String
 * 		}
*/
router.post('/', authenticate, async (req, res) => {
	// Get the user id set by authentication middleware and find user
	const user_id = req.body.client_id;
	const user = await User.findOne({_id: user_id});

	// Check for required fields to be correct
	if (!req.body.hasOwnProperty('plantName')) {
		return res.status(400).json(createResponse(false, {}, 'Please provide plantName for the plant'));
	}

	// Create the plant object to be saved
	const newPlant = {
		plantName: req.body.plantName,
		latinName: req.body.hasOwnProperty('latinName') ? req.body.latinName : '',
		image: req.body.hasOwnProperty('image') ? req.body.image : ''
	};

	// Add the plant to the database
	user.plants.push(newPlant);
	const savedUser = await user.save();

	// Send response
	return res.json(createResponse(true, savedUser.plants.pop() ,`Successfully added new plant with name ${newPlant.plantName} to user ${savedUser.username}`));
});

/** Edits the information of a plant. Requires authentication
 *
 * Input:
 * 		header: { access_token }
 * 		body: {
 * 			plantName String,
 * 			latinName String,
 * 			image String,
 * 		}
 *
 * Returns:
 * 		{
 *      status boolean,
 * 			result plantObject,
 * 			message String
 * 		}
*/

router.put('/:plantID', authenticate, async (req, res) => {
	// Get the user id set by authentication middleware and find user
	const user_id = req.body.client_id;
	const user = await User.findOne({_id: user_id});

	// Check if the plant id matches any plant for this user
	const plantIndex = user.plants.findIndex(plant => {
		return plant._id == req.params.plantID;
	});
	if (plantIndex === -1) {
		return res.status(400).json(createResponse(false, {}, `Could not find plant with ID ${req.params.plantID} belonging to ${user.username}`));
	}

	// Check that at least one of the fields is given
	if (!(req.body.hasOwnProperty('plantName') || req.body.hasOwnProperty('latinName') || req.body.hasOwnProperty('image'))) {
		return res.status(400).json(createResponse(false, {}, 'Could not find anything to add to the database'));
	}

	// Overwrite the fields in the current users plant
	user.plants[plantIndex].plantName = req.body.hasOwnProperty('plantName') ? req.body.plantName : user.plants[plantIndex].plantName;
	user.plants[plantIndex].latinName = req.body.hasOwnProperty('latinName') ? req.body.latinName : user.plants[plantIndex].latinName;
	user.plants[plantIndex].image = req.body.hasOwnProperty('image') ? req.body.image : user.plants[plantIndex].image;
	const savedUser = await user.save();

	// Send response
	return res.json(createResponse(true, savedUser.plants[plantIndex] ,`Successfully edited plant with id ${req.params.plantID}`));
});

/** Deletes a plant. Requires authentication
 *
 * Input:
 * 		header: { access_token }
 *
 * Returns:
 * 		{
 *      status boolean,
 * 			result empty object,
 * 			message String
 * 		}
*/

router.delete('/:plantID', authenticate, async (req, res) => {
	// Get the user id set by authentication middleware and find user
	const user_id = req.body.client_id;
	const user = await User.findOne({_id: user_id});

	// Check if the plant id matches any plant for this user
	const plantIndex = user.plants.findIndex(plant => {
		return plant._id == req.params.plantID;
	});
	if (plantIndex === -1) {
		return res.status(400).json(createResponse(false, {}, `Could not find plant with ID ${req.params.plantID} belonging to ${user.username}`));
	}

	// Delete the plant from the user and save
	user.plants.splice(plantIndex, 1)
	const savedUser = await user.save();

	// Send response
	return res.json(createResponse(true, {} ,`Successfully deleted plant with id ${req.params.plantID}`));
});

module.exports = router;