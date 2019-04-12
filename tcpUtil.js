//var net = require("net");

//function wrap(socket, func)
//{
//	return function (err, reply)
//	{
//		if(err !== null)
//		{
//			gTcpError(socket, "Error: %s when exec \"%s %s\"," +
//				"char id: %d, callback name: %s",
//				err, this.command, this.args,
//				socket.charId, func.name);
//			console.error(err.stack);
//			return;
//		}
//
//		try
//		{
//			func(reply);
//		}
//		catch(ex)
//		{
//			gTcpError(socket, "Exception: %s, char id: %d.", ex.message, socket.charId);
//			console.error(ex.stack);
//			return;
//		}
//	};
//}


