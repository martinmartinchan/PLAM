const jwt = require('jsonwebtoken');
const { createResponse } = require('../misc/helper');

const authenticate = function(req, res, next) {
	// Check that access token is passed as request
	const access_token = req.headers.access_token;

	if (!access_token) return res.status(400).json(createResponse(false, {}, 'Please provide an access token'));

	// Verify the token
	try {
		const user = jwt.verify(access_token, process.env.ACCESS_SECRET);
		// If everything is ok, set the id of the user in the request body as client_id
		req.body.client_id = user._id;
		next();
	} catch(err) {
		return res.status(401).json(createResponse(false, {}, err.toString()));
	}
}

module.exports = authenticate;