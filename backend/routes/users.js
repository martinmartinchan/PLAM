const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const { userIdValidation } = require('../middlewares/validation');

// Get all users in the database
router.get('/all', async (req, res) => {
	const allUsers = await User.find({});
	const allUsersWithoutPassword = allUsers.map((user) => {
		return { username: user.username, _id: user._id }
	})

	return res.json(allUsersWithoutPassword);
});

// Get a specific user
router.get('/:id', userIdValidation, async (req, res) => {
	const user = await User.findById({_id: req.params.id});
	if (!user) {
		return res.status(400).json({ message: `No user with id ${req.params.id} found.` });
	}
	return res.json(user);
});

module.exports = router;