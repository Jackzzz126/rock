const http = require("http");
const https = require("https");
const fs = require('fs');

function run(port, onRequest, certFilePath, keyFilePath)
{
	if(certFilePath && keyFilePath) {
		const options = {
			key: fs.readFileSync(keyFilePath),
			cert: fs.readFileSync(certFilePath)
		};

		https.createServer(options, onRequest).listen(port);
	} else {
		http.createServer(onRequest).listen(port);
	}
}

exports.run = run;
