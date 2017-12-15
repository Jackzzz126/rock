# rock
node.js server lib

#wsServer
```javascript
function onConn(socket) {
	var addressStr = socket._socket.remoteAddress;
	addressStr = addressStr.substr(addressStr.lastIndexOf(":") + 1);
	gLog.info("Client connected: " + addressStr);

	socket.on('message', function(msgData) {
		gLog.debug("Receive msg: %s", msgData);
	});

	socket.on('error', function(err) {
		gLog.debug("Client %s error: %s", addressStr, err);
	});

	socket.on('close', function(code, msg){
		gLog.debug("Client %s closed with code %d.", addressStr, code);
		if(err) {
			gLog.debug("Client %s closed with error: %s", addressStr, msg);
		}
	});
}

rock.wsServer.run(serverConfig.port, onConn);
```
