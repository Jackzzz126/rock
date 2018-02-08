var https=require('https');
var ws=require('ws');
var fs=require('fs');

function run(port, onConn, cerFilePath, keyFilePath) {
	let wss = null;
	if(cerFilePath && keyFilePath) {
		let options = {
			cert: fs.readFileSync(cerFilePath),
			key: fs.readFileSync(keyFilePath),
			//passphrase:'1234'
		};
		var server=https.createServer(options, function (req, res) {
			res.writeHead(403);
			res.end("This is a WebSockets server!\n");
		}).listen(port);

		wss = new ws.Server({server: server});
	} else {
		wss = new ws.Serve({port: port});
	}
	wss.on('connection', function(socket, req) {
		if(onConn) {
			onConn(socket, req);
		}
	});
}

exports.run = run;

