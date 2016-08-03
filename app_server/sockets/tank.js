var refreshWaterDistribution = require('./motor').refreshWaterDistribution;

module.exports = function (socket, io, sockets, deviceMap, deviceStatus) {
	deviceStatus[socket.id] = { status: 'off', level: 0 };

	socket.on('level', function (message) {
		deviceStatus[socket.id].level = message.level;
	});

	socket.on('get water', function () {
		deviceStatus[socket.id].status = 'on';
		var motors = deviceMap[socket.id][1].clients.motors;
		motors.forEach(function (motor) {
			var motorSocketId = sockets.motors[motor._id];
			if (motorSocketId) {
				if (deviceStatus[motorSocketId].status === 'off') {
					io.sockets.connected[motorSocketId].emit('status', { status: 'on' });
				}
			}
		});
		refreshWaterDistribution(io, sockets, deviceMap, deviceStatus);
	});

	socket.on('stop water', function () {
		deviceStatus[socket.id].status = 'off';
		refreshWaterDistribution(io, sockets, deviceMap, deviceStatus);
	});

	socket.on('disconnect', function () {
		var type = deviceMap[socket.id][0];
		var id = deviceMap[socket.id][1]._id;
		console.log(type + ' ' + id + ' disconnected');
		delete deviceMap[socket.id];
		delete deviceStatus[socket.id];
		delete sockets[type + 's'][id];
		refreshWaterDistribution(io, sockets, deviceMap, deviceStatus);
	});
};
