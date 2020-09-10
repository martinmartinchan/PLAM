const mongoose = require('mongoose');

function checkUsername(username) {
	// Check username length
	if (username.length <= 3) {
		return false;
	}

	// Check username not containing special characters
	if(!/^[A-Za-z0-9]+$/.test(username)) {
		return false;
	}
	return true;
}

function checkPassword(password) {
	// Check password length
	if (password.length <= 5) {
		return false;
	}

	// Check password contains letters
	if (!/[A-Za-z]/.test(password)) {
		return false;
	}

	// Check password contains numbers
	if (!/[0-9]/.test(password)) {
		return false;
	}
	return true;
}

// Function to validate the input on register
const registerValidation = function(req, res, next) {
	const { username, password } = req.body;

	// Check fields exists
	if (!username || !password) return res.status(400).json({ message: "Please provide a username and a password." });

	// Check username
	if (!checkUsername(username)) return res.status(400).json({ message: "Username must be at least 4 characters long and can not contain special characters." });

	// Check password
	if (!checkPassword(password)) return res.status(400).json({ message: "Password must contain both letters and numbers and be at least 6 characters long."});

	next();
}
module.exports.registerValidation = registerValidation;

// Function to validate the input on login
const loginValidation = function(req, res, next) {
	const { username, password } = req.body;

	// Check fields exists
	if (!username || !password) return res.status(400).json({ message: "Please provide a username and a password." });

	next();
}
module.exports.loginValidation = loginValidation;

// Function to valide the user id when sent by client
const userIdValidation = function(req, res, next) {
	if (mongoose.Types.ObjectId.isValid(req.params.id)) {
		next();
	} else {
		return res.status(400).json({ message: `No user with id ${req.params.id} found.` });
	}
}
module.exports.userIdValidation = userIdValidation;