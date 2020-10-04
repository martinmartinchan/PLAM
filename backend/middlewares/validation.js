const mongoose = require('mongoose');
const { createResponse } = require('../misc/helper');

function checkUsername(username) {
	// Check username length
	if (username.length <= 3 || username.length >= 256) {
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

function checkEmail(email) {
	const regExpEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (!regExpEmail.test(email)) {
		return false;
	}
	return true;
}

// Function to validate the input on register
const registerValidation = function(req, res, next) {
	const { username, password, email } = req.body;

	// Check fields exists
	if (!username || !password || !email) return res.status(400).json(createResponse(false, {}, "Please provide a username, a password, and an email."));

	// Check username
	if (!checkUsername(username)) return res.status(400).json(createResponse(false, {}, "Username must be at least 4 characters long and can not contain special characters."));

	// Check password
	if (!checkPassword(password)) return res.status(400).json(createResponse(false, {}, "Password must contain both letters and numbers and be at least 6 characters long."));

	// Check email
	if (!checkEmail(email)) return res.status(400).json(createResponse(false, {}, "Email is invalid"));

	next();
}
module.exports.registerValidation = registerValidation;

// Function to validate the input on login
const loginValidation = function(req, res, next) {
	const { username, email, password } = req.body;

	// Check username or email exists
	if (!username && !email) return res.status(400).json(createResponse(false, {}, "Please provide a username or an email."));

	// Check username and email not existing at the same time
	if (username && email) return res.status(400).json(createResponse(false, {}, "Please provide username or email. Not both."));

	// Check password exists. Don't validate it.
	if (!password) return res.status(400).json(createResponse(false, {}, "Please provide a password."));

	// Validate username and set usernameSent if username sent. Otherwise, validate email.
	if (username) {
		if (!checkUsername(username)) return res.status(400).json(createResponse(false, {}, "Username must be at least 4 characters long and can not contain special characters."));
		req.body.usernameSent = true;
	} else {
		if (!checkEmail(email)) return res.status(400).json(createResponse(false, {}, "Email is invalid"));
		req.body.usernameSent = false;
	}

	next();
}
module.exports.loginValidation = loginValidation;

// Function to validate the number on get request for multiple plant posts
const countQueryValidation = function(req, res, next) {
	// If no count is passed in the query, set hasCount to false
	if (req.query.hasOwnProperty('count')) {
		const count = Number(req.query.count);

		// Check that it is an integer
		if (!Number.isInteger(count)) return res.status(400).json(createResponse(false, {}, 'Please provide a positive integer as count'));

		// Check that it is positive
		if (count <= 0) return res.status(400).json(createResponse(false, {}, 'Please provide a positive integer as count'));

		req.hasCount = true;
	} else {
		req.hasCount = false;
	}
	next();
}
module.exports.countQueryValidation = countQueryValidation;