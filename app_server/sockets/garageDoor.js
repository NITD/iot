module.exports = function (socket, io, sockets, deviceMap, deviceStatus) {
	deviceStatus[socket.id] = { status: 'closed' };

	socket.on('status', function (msg) {
		deviceStatus[socket.id] = { status: msg.status };
	});

	socket.on('get status', function () {
		var client = deviceMap[socket.id][1].clients.switchSensor;
		if (client) {
			var clientsocketid = sockets.switchSensors[client._id];
			if (deviceStatus[clientsocketid]) {
				var sensorStatus = deviceStatus[clientsocketid].status;
				socket.emit('status', { status: sensorStatus });
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
	});
};
