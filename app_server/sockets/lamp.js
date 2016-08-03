var updateControlApp = require('./control').updateControlApp;

module.exports = function (socket, io, sockets, deviceMap, deviceStatus, appSockets) {
	deviceStatus[socket.id] = { status: 'off' };
	updateControlApp(io, appSockets, deviceStatus, deviceMap);

	socket.on('status', function (msg) {
		deviceStatus[socket.id] = { status: msg.status };
		updateControlApp(io, appSockets, deviceStatus, deviceMap);
	});

	socket.on('get status', function () {
		var client = deviceMap[socket.id][1].clients.switchSensor;
		if (client) {
			var clientsocketid = sockets.switchSensors[client._id];
			if (deviceStatus[clientsocketid]) {
				socket.emit('status', { status: deviceStatus[clientsocketid].status });
			}
		}
	});

	socket.on('disconnect', function () {
		var type = deviceMap[socket.id][0];
		var id = deviceMap[socket.id][1]._id;
		console.log(type + ' ' + id + ' disconnected');
		delete deviceMap[socket.id];
		delete deviceStatus[socket.id];
		delete sockets[type + 's'][id];
		updateControlApp(io, appSockets, deviceStatus, deviceMap);
	});
};
