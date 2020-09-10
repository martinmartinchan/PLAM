const createResponse = function(status, result, message) {
	return {
		status: status,
		result: result,
		message: message
	}
}

module.exports.createResponse = createResponse;