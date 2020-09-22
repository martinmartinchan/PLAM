const createResponse = function(success, result, message) {
	return {
		success: success,
		result: result,
		message: message
	}
}

module.exports.createResponse = createResponse;