var net = require("net");

function run(port, onConn)
{
    let tcpServerOptions = {
        allowHalfOpen: false
    };
    let tcpServer = net.createServer(tcpServerOptions);
    tcpServer.on("connection", onConn);
    tcpServer.listen(port);
}

exports.run = run;
