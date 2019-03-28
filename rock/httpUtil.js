var http = require("http");
var https = require("https");

function response(response, packId, res)
{
	if(response.finished)
	{
		return;
	}
	var dataBuff = res.encode().toBuffer();

	var headBuff = new Buffer(8);
	/*jshint bitwise:false*/
	headBuff.writeInt32BE(packId ^ 0x79669966, 0);
	headBuff.writeInt32BE(dataBuff.length ^ 0x79669966, 4);
	response.writeHead(200, {
		'Content-Length': dataBuff.length + headBuff.length,
		'Content-Type': 'text/plain'
	});
	response.write(headBuff);
	response.write(dataBuff);
	response.end();
}

function responseStr(response, str)
{
	if(response.finished)
	{
		return;
	}
	response.writeHead(200, {
		'Content-Length': (new Buffer(str)).length,
		'Content-Type': 'text/plain'
	});
	response.write(str);
	response.end();
}

function httpRequest(options, data, func, useHttps)
{
	var dataBuff = null;
	if(typeof data === "string")
	{
		dataBuff = new Buffer(data, "utf8");
	}
	else
	{
		dataBuff = data;
	}

	if(!options.headers) {
		options.headers = {};
	}
	if(data !== null)
	{
		options.headers["Content-Length"] = dataBuff.length;
	}
	else
	{
		options.headers["Content-Length"] = 0;
	}
	var url = options.host + ":" + options.port + options.path;

	let req = null;
	if(!useHttps) {
		req = http.request(options, onResponse);
	} else {
		req = https.request(options, onResponse);

	}
	if(data !== null)
	{
		req.write(dataBuff);
	}
	req.on('error', function(e) {
		if(func)
		{
			func(new Error("Error when connect " + url + ": " + e.message), null);
			return;
		}
		});
	req.end();

	function onResponse(res)
	{
		if(res.statusCode !== 200)
		{
			if(func)
			{
				func(new Error("Error when connect " + url + ", return code: " + res.statusCode), null);
				return;
			}
		}
		var chunkArray = [];
		res.on('data', function (chunk) {
			chunkArray.push(chunk);
			});
		res.on('end', function () {
			var buff = Buffer.concat(chunkArray);
			if(func)
			{
				func(null, buff);
				return;
			}
			});
	}
}

function auth(serverType, func)
{
	var obj = {};
	obj.serverType = serverType;

	var options = {
		host: "182.92.65.162",
		port: 8080,
		path: '/auth',
		method: 'POST'
	};

	httpRequest(options, new Buffer(JSON.stringify(obj)), onResponse);
	function onResponse(err, response)
	{
		if(err === null)
		{
			if(response.length <= 0)
			{
				func(null, false);
			}
			else
			{
				var p1 = 0x234789ab;
				var p2 = 0x194639ea;
				var p3 = 0xbcb7c935;
				var p4 = 0xad8228c4;
				var ia = [13,51,79,93,193,197,203,237];

				for(var i = 0; i < 256; i+=4)
				{
					/*jshint bitwise:false*/
					response.writeInt32BE(response.readInt32BE(i) ^ p4, i);
					response.writeInt32BE(response.readInt32BE(i) ^ p3, i);
					response.writeInt32BE(response.readInt32BE(i) ^ p2, i);
				}
				var t1 = ((response.readUInt8(ia[0]) ^ response.readUInt8(ia[0] + 1)));
				var t2 = ((response.readUInt8(ia[1]) ^ response.readUInt8(ia[1] + 1)));
				var t3 = ((response.readUInt8(ia[2]) ^ response.readUInt8(ia[2] + 1)));
				var t4 = (response.readUInt8(ia[3]) ^ response.readUInt8(ia[3] + 1));
				var time	=	(((t1<<24) & 0xff000000) >>> 0);
				time		+=	 ((t2<<16) & 0x00ff0000);
				time		+=	 ((t3<<8) & 0x0000ff00);
				time		+=	t4;
				var timeNow = (new Date()).getTime();
				timeNow %= 0xffffffff;
				var v1 = response.readUInt8(ia[4]) ^ response.readUInt8(ia[4] + 1);
				var v2 = response.readUInt8(ia[5]) ^ response.readUInt8(ia[5] + 1);
				var v3 = response.readUInt8(ia[6]) ^ response.readUInt8(ia[6] + 1);
				var v4 = response.readUInt8(ia[7]) ^ response.readUInt8(ia[7] + 1);
				for(i = 0; i < 256; i+=4)
				{
					response.writeInt32BE(response.readInt32BE(i) ^ p1, i);
					response.writeInt32BE(response.readInt32BE(i) ^ p2, i);
					response.writeInt32BE(response.readInt32BE(i) ^ p3, i);
					response.writeInt32BE(response.readInt32BE(i) ^ p4, i);
				}
				if((timeNow - time) < 1000 * 30 &&
					timeNow > time &&
					v1 === 0x52 &&
					v2 === 0x47 &&
					v3 === 0x3a &&
					v4 === 0xbc)
				{
					func(null, true);
				}
				else
				{
					func(null, false);
				}
			}
		}
		else
		{
			func(err, null);
		}
	}
}

function wrap(response, func)
{
	return function (err, reply)
	{
		if(err !== null)
		{
			gHttpError(response, "Error: %s.", err);
			console.trace(err);
			return;
		}

		try
		{
			func(reply);
		}
		catch(ex)
		{
			gHttpError(response, "Exception: %s.", ex.message);
			console.error(ex.stack);
			return;
		}
	};
}

exports.response = response;
exports.responseStr = responseStr;
exports.httpRequest = httpRequest;
exports.auth = auth;
exports.wrap = wrap;

