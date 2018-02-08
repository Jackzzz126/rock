const https = require("https");
const fs = require('fs');

function run(port, onRequest, certFile, keyFile)
{
	const options = {
		key: fs.readFileSync(keyFile),
		cert: fs.readFileSync(certFile)
	};

	https.createServer(options, onRequest).listen(port);
}

exports.run = run;
