const router = require('express').Router();

const User = require('../models/User');
const { createResponse } = require('../misc/helper');
const authenticate = require('../middlewares/authentication');

/**
 * GET
 * In: -
 * Out: Array[(Object) user]
 */
router.get('/all', async (req, res) => {
	const allUsers = await User.find({});
	const allUsersWithoutPassword = allUsers.map((user) => {
		return { username: user.username, _id: user._id, email: user.email }
	})

	return res.json(createResponse(true, allUsersWithoutPassword, 'Succesfully retrieved all users from database.'));
});

/**
 * GET
 * In: -
 * Out: (Object) user
 */
router.get('/', async (req, res) => {
	try {
		const user = await User.findById({_id: req.query.id});

		const {_id, username, email} = user;
		const userToReturn = {
			_id: _id,
			username: username,
			email: email
		}

		return res.json(createResponse(true, userToReturn, `Successfully retrieved user with id ${req.query.id}.`));
	} catch {
		return res.status(400).json(createResponse(false, {}, `No user with id ${req.query.id} found.`));
	}
});

/**
 * GET
 * In: header.access_token
 * Out: (Object) user
 */
router.get('/token', authenticate, async (req, res) => {
	try {
		// Client ID is set by athenticate middleware
		const user = await User.findById({_id: req.body.client_id});

		const {_id, username, email} = user;
		const userToReturn = {
			_id: _id,
			username: username,
			email: email
		}

		return res.json(createResponse(true, userToReturn, 'Successfully retrieved user with the accesstoken'));
	} catch {
		// If user was deleted but token was still used
		return res.status(400).json(createResponse(false, {}, `User with id ${req.body.client_id} has been deleted`));
	}
});

module.exports = router;