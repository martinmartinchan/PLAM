const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const { userIdValidation } = require('../middlewares/validation');
const { createResponse } = require('../misc/helper');
const authenticate = require('../middlewares/authentication');

// Get all users in the database
router.get('/all', async (req, res) => {
	const allUsers = await User.find({});
	const allUsersWithoutPassword = allUsers.map((user) => {
		return { username: user.username, _id: user._id }
	})

	return res.json(createResponse(true, allUsersWithoutPassword, 'Succesfully retrieved all users from database.'));
});

// Get a specific user with the ID
router.get('/:id', userIdValidation, async (req, res) => {
	const user = await User.findById({_id: req.params.id});
	if (!user) {
		return res.status(400).json(createResponse(false, {}, `No user with id ${req.params.id} found.`));
	}
	return res.json(createResponse(false, user, `Successfully retrieved user with id ${req.params.id}.`));
});

// Get a specific user with access token
router.get('/token', authenticate, async (req, res) => {
	// Client ID is set by athenticate middleware
	const user = await User.findById({_id: req.body.client_id});

	const {_id, username, email} = user;
	const userToReturn = {
		_id: _id,
		username: username,
		email: email
	}

	return res.json(createResponse(true, userToReturn, 'Successfully retrieved user with the accesstoken'));
});

module.exports = router;