var WebSocketServer = require('ws').Server;

function run(port, onConn) {
	var wss = new WebSocketServer({port: port});

	wss.on('connection', function(socket, req) {
		if(onConn) {
			onConn(socket, req);
		}
	});
}

exports.run = run;

