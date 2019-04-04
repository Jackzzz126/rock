var net = require("net");

function response(socket, packId, res)
{
	var dataBuff = res.encode().toBuffer();

	var headBuff = new Buffer(8);
	/*jshint bitwise:false*/
	headBuff.writeInt32BE(packId ^ 0x79669966, 0);
	headBuff.writeInt32BE(dataBuff.length ^ 0x79669966, 4);

	if(socket.writable)
	{
		socket.write(headBuff);
		socket.write(dataBuff);
	}
}

function end(socket, packId, res)
{
	var dataBuff = res.encode().toBuffer();

	var headBuff = new Buffer(8);
	/*jshint bitwise:false*/
	headBuff.writeInt32BE(packId ^ 0x79669966, 0);
	headBuff.writeInt32BE(dataBuff.length ^ 0x79669966, 4);

	if(socket.writable)
	{
		socket.write(headBuff);
		socket.end(dataBuff);
	}
}

function httpResponse(socket, request, res)
{
	var headStr = "";
	headStr += "HTTP/1.1 200 OK\r\n";
	headStr += "Content-Type: text/plain\r\n";
	headStr += "Connection: keep-alive\r\n";

	var dataBuff = null;
	if(typeof res === "string")
	{
		dataBuff = new Buffer(res, "utf8");
	}
	else
	{
		dataBuff = res;
	}
	headStr += "Content-Length: " + dataBuff.length + "\r\n";

	if(request.origin)
	{
		headStr += "Access-Control-Allow-Origin: " + request.origin + "\r\n";
	}
	headStr += "\r\n";

	if(socket.writable)
	{
		socket.write(new Buffer(headStr, "utf8"));
		socket.write(dataBuff);
	}
}

function httpResError(socket, retCode)
{
	var res = "";
	var headStr = "";
	if(retCode === 404)
	{
		headStr += "HTTP/1.1 404 Not Found\r\n";
		res = "404 Not found";
	}
	if(retCode === 500)
	{
		headStr += "HTTP/1.1 500 Internal Server Error\r\n";
		res = "500 Server Error";
	}
	headStr += "Content-Type: text/plain\r\n";
	headStr += "Connection: keep-alive\r\n";

	var dataBuff = new Buffer(res, "utf8");
	headStr += "Content-Length: " + dataBuff.length + "\r\n";
	headStr += "\r\n";

	if(socket.writable)
	{
		socket.write(new Buffer(headStr, "utf8"));
		socket.write(dataBuff);
	}
}

function httpEnd(socket, request, res)
{
	httpResponse(socket, request, res);
	socket.end();
}


//cbFunc(err, packId, dataBuff)
function sendOnce(ip, port, packId, dataBuff, cbFunc)
{
	var HEAD_LENGTH = 8;
	var HEAD_MASK = 0x79669966;

	var socket = net.createConnection(port, ip);
	socket.on("connect", onConn);
	socket.on("error", onError);
	socket.on("data", onRecvData);

	function onConn()
	{
		var headBuff = new Buffer(HEAD_LENGTH);
		/*jshint bitwise:false*/
		headBuff.writeInt32BE(packId ^ HEAD_MASK, 0);
		headBuff.writeInt32BE(dataBuff.length ^ HEAD_MASK, 4);

		socket.write(headBuff);
		socket.write(dataBuff);
	}
	function onError(err)
	{
		socket.end();
		cbFunc(err, null, null);
	}


	var dataPacksRecved = [];
	function onRecvData(dataBuff)
	{
		dataPacksRecved.push(dataBuff);

		var totalLen = 0;
		for(var i in dataPacksRecved)
		{
			totalLen += dataPacksRecved[i].length;
		}

		if(totalLen < HEAD_LENGTH)
		{
			return;
		}

		if(dataPacksRecved[0].length < HEAD_LENGTH)
		{
			var buff = Buffer.concat(dataPacksRecved);
			dataPacksRecved = [];
			dataPacksRecved.push(buff);
		}

		/*jshint bitwise:false*/
		var packId = dataPacksRecved[0].readInt32BE(0) ^ HEAD_MASK;
		var packLen = dataPacksRecved[0].readInt32BE(4) ^ HEAD_MASK;
		if(totalLen < (packLen + HEAD_LENGTH))
		{
			return;
		}

		socket.end();
		var recvBuff = Buffer.concat(dataPacksRecved);
		cbFunc(null, packId, recvBuff.slice(HEAD_LENGTH, packLen + HEAD_LENGTH));
	}
}

function wrap(socket, func)
{
	return function (err, reply)
	{
		if(err !== null)
		{
			gTcpError(socket, "Error: %s when exec \"%s %s\"," +
				"char id: %d, callback name: %s",
				err, this.command, this.args,
				socket.charId, func.name);
			console.error(err.stack);
			return;
		}

		try
		{
			func(reply);
		}
		catch(ex)
		{
			gTcpError(socket, "Exception: %s, char id: %d.", ex.message, socket.charId);
			console.error(ex.stack);
			return;
		}
	};
}

function httpWrap(socket, func)
{
	return function(err, reply)
	{
		if(err !== null)
		{
			httpResError(500);
			console.error("Error: %s when exec \"%s %s\"," +
				"callback name: %s",
				err, this.command, this.args,
				func.name);
			console.error(err.stack);
			return;
		}

		try
		{
			func(reply);
		}
		catch(ex)
		{
			httpResError(500);
			console.error("Exception: %s.", ex.message);
			console.error(ex.stack);
			return;
		}
	};
}

function newConn(ip, port, errFunc, dataFunc)
{
	var conn = {};

	conn.ip = ip;
	conn.port = port;
	conn.socket = null;
	conn.errFunc = null;
	if(errFunc)
	{
		conn.errFunc = errFunc;
	}
	conn.dataFunc = null;
	if(dataFunc)
	{
		conn.dataFunc = dataFunc;
	}

	return conn;
}

function send(conn, packId, dataBuff)
{
	var HEAD_LENGTH = 8;
	var HEAD_MASK = 0x79669966;

	if(conn.socket === null)
	{
		conn.socket = net.createConnection(conn.port, conn.ip);
		conn.socket.on("connect", onConn);
		conn.socket.on("error", onError);
		conn.socket.on("close", onClose);
		conn.socket.on("data", onRecvData);
	}
	else
	{
		writeData();
	}

	function writeData()
	{
		var headBuff = new Buffer(HEAD_LENGTH);
		/*jshint bitwise:false*/
		headBuff.writeInt32BE(packId ^ HEAD_MASK, 0);
		headBuff.writeInt32BE(dataBuff.length ^ HEAD_MASK, 4);

		conn.socket.write(headBuff);
		conn.socket.write(dataBuff);
	}

	function onConn()
	{
		writeData();
	}
	function onError(err)
	{
		conn.socket.end();
		conn.cbFunc(err);
	}
	function onClose(err)
	{
		conn.socket = null;
	}


	var dataPacksRecved = [];
	function onRecvData(dataBuff)
	{
		dataPacksRecved.push(dataBuff);

		var totalLen = 0;
		for(var i in dataPacksRecved)
		{
			totalLen += dataPacksRecved[i].length;
		}

		if(totalLen < HEAD_LENGTH)
		{
			return;
		}

		if(dataPacksRecved[0].length < HEAD_LENGTH)
		{
			var buff = Buffer.concat(dataPacksRecved);
			dataPacksRecved = [];
			dataPacksRecved.push(buff);
		}

		/*jshint bitwise:false*/
		var packId = dataPacksRecved[0].readInt32BE(0) ^ HEAD_MASK;
		var packLen = dataPacksRecved[0].readInt32BE(4) ^ HEAD_MASK;
		if(totalLen < (packLen + HEAD_LENGTH))
		{
			return;
		}

		var recvBuff = Buffer.concat(dataPacksRecved);
		conn.dataFunc(packId, recvBuff.slice(HEAD_LENGTH, packLen + HEAD_LENGTH));

		dataPacksRecved = [];
		if((totalLen - HEAD_LENGTH - packLen) > 0)
		{
			var restBuff = new Buffer(totalLen - HEAD_LENGTH - packLen);
			recvBuff.copy(restBuff, 0, HEAD_LENGTH + packLen, totalLen);
			dataPacksRecved.push(restBuff);
		}
	}
}

exports.response = response;
exports.end = end;
exports.httpResponse = httpResponse;
exports.httpResError = httpResError;
exports.httpEnd = httpEnd;
exports.sendOnce = sendOnce;
exports.wrap = wrap;
exports.httpWrap = httpWrap;
exports.newConn = newConn;
exports.send = send;

