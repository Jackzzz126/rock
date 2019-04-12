var http = require("http");
var https = require("https");
const querystring = require('querystring');

//opts
//host, port=80, path, method = post; useHttps = false
function httpRequest(opts, data, func)
{
	if(!opts.headers) {
		opts.headers = {};
	}
	if(!opts.port) {
		opts.port = 80;
	}
	if(!opts.method) {
		opts.method = 'POST';
	}

	var dataBuff = null;
	if(typeof data === "string") {
		dataBuff = new Buffer(data, "utf8");
	} else if(Buffer.isBuffer(data)){
		dataBuff = data;
	} else {
		dataBuff = new Buffer(JSON.stringify(data), "utf8");
	}

	if(data !== null) {
		opts.headers["Content-Length"] = dataBuff.length;
	} else {
		opts.headers["Content-Length"] = 0;
	}

	let path = opts.path;
	if(opts.method.toUpperCase() === "GET" && dataBuff !== null) {
		path += "?";
		path += querystring.stringify(JSON.parse(dataBuff));
	}

	let req = null;
	let optObj = {};
	optObj.host = opts.host;
	optObj.port = opts.port;
	optObj.method = opts.method;
	optObj.path = path;

	if(!opts.useHttps) {
		req = http.request(optObj, onResponse);
	} else {
		req = https.request(optObj, onResponse);
	}
	if(opts.method.toUpperCase() === "POST" && dataBuff !== null) {
		req.write(dataBuff);
	}
	req.on('error', function(e) {
		if(func) {
			func(new Error("Error when connect " + path + ": " + e.message), null);
			return;
		}
	});
	req.end();

	function onResponse(res)
	{
		if(res.statusCode !== 200) {
			if(func) {
				func(new Error("Error when connect " + path + ", return code: " + res.statusCode), null);
				return;
			}
		}
		var chunkArray = [];
		res.on('data', function (chunk) {
			chunkArray.push(chunk);
		});
		res.on('end', function () {
			var buff = Buffer.concat(chunkArray);
			if(func) {
				func(null, buff);
				return;
			}
		});
	}
}

//function wrap(response, func)
//{
//	return function (err, reply)
//	{
//		if(err !== null)
//		{
//			gHttpError(response, "Error: %s.", err);
//			console.trace(err);
//			return;
//		}
//
//		try
//		{
//			func(reply);
//		}
//		catch(ex)
//		{
//			gHttpError(response, "Exception: %s.", ex.message);
//			console.error(ex.stack);
//			return;
//		}
//	};
//}

exports.httpRequest = httpRequest;

