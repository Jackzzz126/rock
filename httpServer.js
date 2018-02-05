var http = require("http");

function run(port, onRequest)
{
	http.createServer(onRequest).listen(port);
}

exports.run = run;
