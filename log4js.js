var util = require('util');
var log4js = require('log4js');

function createLog(logName) {
	let log = {};
	log._logger = log4js.getLogger(logName);

	log.debug = function(){
		this._logger.debug(util.format.apply(null, arguments));
	};
	log.info = function(){
		this._logger.info(util.format.apply(null, arguments));
	};
	log.warn = function(){
		this._logger.warn(util.format.apply(null, arguments));
	};
	log.error = function(){
		this._logger.error(util.format.apply(null, arguments));
	};

	return log;
}

exports.createLog = createLog;

