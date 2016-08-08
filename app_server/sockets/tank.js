var updateControlApp = require('./control').updateControlApp;
var refreshWaterDistribution = require('./motor').refreshWaterDistribution;

module.exports = function (socket, io, sockets, deviceMap, deviceStatus, appSockets) {
	deviceStatus[socket.id] = { status: 'off', level: 0 };
	updateControlApp(io, appSockets, deviceStatus, deviceMap);

	socket.on('level', function (message) {
		deviceStatus[socket.id].level = message.level;
		updateControlApp(io, appSockets, deviceStatus, deviceMap);
	});

	socket.on('get water', function () {
		deviceStatus[socket.id].status = 'on';
		updateControlApp(io, appSockets, deviceStatus, deviceMap);
		var motors = deviceMap[socket.id][1].clients.motors;
		motors.forEach(function (motor) {
			var motorSocketId = sockets.motors[motor._id];
			if (motorSocketId) {
				if (deviceStatus[motorSocketId].status === 'off') {
                    console.log('status from lamp');
					io.sockets.connected[motorSocketId].emit('status', { status: 'on' });
				}
			}
		});
		refreshWaterDistribution(io, sockets, deviceMap, deviceStatus);
	});

	socket.on('stop water', function () {
		deviceStatus[socket.id].status = 'off';
		updateControlApp(io, appSockets, deviceStatus, deviceMap);
		refreshWaterDistribution(io, sockets, deviceMap, deviceStatus);
	});

	socket.on('disconnect', function () {
		var type = deviceMap[socket.id][0];
		var id = deviceMap[socket.id][1]._id;
		console.log(type + ' ' + id + ' disconnected');
		delete deviceMap[socket.id];
		delete deviceStatus[socket.id];
		delete sockets[type + 's'][id];
		updateControlApp(io, appSockets, deviceStatus, deviceMap);
		refreshWaterDistribution(io, sockets, deviceMap, deviceStatus);
	});
};
