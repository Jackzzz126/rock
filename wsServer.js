var WebSocketServer = require('ws').Server;

function run(port, onConn) {
	var wss = new WebSocketServer({port: port});

	wss.on('connection', function(socket) {
		if(onConn) {
			onConn(socket);
		}
	});
}

exports.run = run;

