var clientTypes = ['lamps', 'garageDoors'];
var updateControlApp = require('./control').updateControlApp;

module.exports = function (socket, io, sockets, deviceMap, deviceStatus, appSockets) {
	deviceStatus[socket.id] = { status: 'off' };
	updateControlApp(io, appSockets, deviceStatus, deviceMap);

	function sendStatusToClients(msg) {
		deviceStatus[socket.id] = { status: msg.status };
		updateControlApp(io, appSockets, deviceStatus, deviceMap);
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
		sendStatusToClients({ status: 'off' });
		var type = deviceMap[socket.id][0];
		var id = deviceMap[socket.id][1]._id;
		console.log(type + ' ' + id + ' disconnected');
		delete deviceMap[socket.id];
		delete deviceStatus[socket.id];
		delete sockets[type + 's'][id];
		updateControlApp(io, appSockets, deviceStatus, deviceMap);
	});
};
