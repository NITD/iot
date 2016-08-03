var clientTypes = ['fans'];

module.exports = function (socket, io, sockets, deviceMap, deviceStatus) {
	deviceStatus[socket.id] = { status: 'off', level: 0 };

	function sendStatusToClients(msg) {
		deviceStatus[socket.id] = { status: msg.status, level: msg.level };
		var clients = deviceMap[socket.id][1].clients;
		clientTypes.forEach(function (device) {
			clients[device].forEach(function (client) {
				if (sockets[device] && sockets[device][client._id]) {
					io.sockets.connected[sockets[device][client._id]].emit('status', msg);
				}
			});
		});
	}

	socket.on('status', sendStatusToClients);

	socket.on('disconnect', function () {
		sendStatusToClients({ status: 'off', level: 0 });
		var type = deviceMap[socket.id][0];
		var id = deviceMap[socket.id][1]._id;
		console.log(type + ' ' + id + ' disconnected');
		delete deviceMap[socket.id];
		delete deviceStatus[socket.id];
		delete sockets[type + 's'][id];
	});
};
