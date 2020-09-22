const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../middlewares/validation');
const { createResponse } = require('../misc/helper');

// Route for register
router.post('/register', registerValidation, async (req, res) => {
	// Check if the user exists in the database
	let userExist = await User.findOne({usernameLowerCase: req.body.username.toLowerCase()});
	if (userExist) return res.status(400).json(createResponse(false, {}, 'Username already exists'));

	// Check if the email exists in the database
	userExist = await User.findOne({email: req.body.email.toLowerCase()});
	if (userExist) return res.status(400).json(createResponse(false, {}, 'Email already exists'));

	// Generate a hashed password with bcrypt
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	// Store the new user in the database
	const user = new User({
		username: req.body.username,
		usernameLowerCase: req.body.username.toLowerCase(),
		email: req.body.email.toLowerCase(),
		password: hashedPassword
	});
	try {
		const savedUser = await user.save();
		return res.json(createResponse(true, { user_id: savedUser._id }, `Successfully created user with username ${savedUser.username}`));
	} catch(err) {
		return res.status(400).json(createResponse(false, {}, err));
	}
});

// Route to login
router.post('/login', loginValidation, async (req, res) => {
	// Check if the user exists in the database
	const user = await User.findOne({ username: req.body.username });
	if (!user) return res.status(400).json({ message: 'Username or password does not exist 1' });

	// Check if the password is correct
	const validPass = await bcrypt.compare(req.body.password, user.password);
	if (!validPass) return res.status(401).json({ message: 'Username or password does not exist 2' });

	// Generate an access token for the client
	const access_token = jwt.sign({ _id: user._id }, process.env.ACCESS_SECRET, { expiresIn: 3600 }); // access tokens expires in 1 hour
	const refresh_token = jwt.sign({ _id: user._id }, process.env.REFRESH_SECRET, { expiresIn: 2592000 }); // Refresh tokens expires in 30 days

	// Set the cookie with the refresh token
	res.cookie('refresh', refresh_token, {
		maxAge: 2592000000, // 30 days
		httpOnly: true,
		sameOrigin: 'none'
	});

	// Send access_token
	res.json({ access_token: access_token, message: 'Successfully logged in' });
});

// Route to refresh access token with the refresh token as a cookie
router.post('/refresh', async (req, res) => {
	// Check that a refresh token is there in the header as a cookie
	const refreshToken = req.cookies.refresh;
	if (!refreshToken) return res.status(400).json({ message: 'No user logged in on this client' });

	try {
		// Verify the refresh token
		const user = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

		// Generate a new access token for the client
		const access_token = jwt.sign({ _id: user._id }, process.env.ACCESS_SECRET, { expiresIn: 3600 }); // access tokens expires in 1 hour

		res.json({ access_token: access_token, message: 'Successfully refreshed an accesstoken' });
	} catch(err) {
		// Send 401 status if token is invalid
		res.status(401).json({ message: err });
	}
});

module.exports = router;