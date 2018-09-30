var statusCodes = require('http-status-codes');
var debug = require('debug')('task-manager:error');

debug.log = console.info.bind(console);

function error(status, err) {
	return {
		status: status,
		data: {
			statusError: statusCodes.getStatusText(status),
			err: err
		}
	};
}

function unauthorized(err) {
	return error(statusCodes.UNAUTHORIZED, err);
}

function sendError(res, e) {
	res.status(e.status).send(e.data);
}

function badRequest(err) {
	return error(statusCodes.BAD_REQUEST, err);
}

function serverError(err) {
	return error(statusCodes.INTERNAL_SERVER_ERROR, err);
}

function notAcceptable(err) {
	return error(statusCodes.NOT_ACCEPTABLE, err);
}

function notFound(err) {
	return error(statusCodes.NOT_FOUND, err);
}


process.on('uncaughtException', function(ex) {
	debug('Uncaught Exception', { exception: ex });
	process.nextTick(function() {
		process.exit(1);
	});
});

module.exports.unauthorized = unauthorized;
module.exports.badRequest = badRequest;
module.exports.notFound = notFound;
module.exports.notAcceptable = notAcceptable;
module.exports.serverError = serverError;
module.exports.sendError = sendError;
module.exports.notFound = notFound;