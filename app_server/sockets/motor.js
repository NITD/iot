var updateControlApp = require('./control').updateControlApp;

var timers = [];
function refreshWaterDistribution(io, sockets, deviceMap, deviceStatus, appSockets) {
    console.log('wow');
	timers.forEach(function (timer) {
		clearInterval(timer);
	});
	timers = [];
	var timerids = [];
	var rates = { };
	var requestingTanks = { };
	for (motorid in sockets.motors) {
        console.log('infor');
		if (sockets.motors.hasOwnProperty(motorid)) {
            console.log('infirstif');
			var motor = sockets.motors[motorid];
            console.log(deviceStatus[motor].status);
			if (deviceStatus[motor].status === 'on') {
                
				var tanks = deviceMap[motor][1].clients.tanks;
				var num = 0;
				tanks.forEach(function (tank) {
					var tankid = sockets.tanks[tank._id];
					if (tankid && deviceStatus[tankid].status === 'on') {
						num += 1;
						requestingTanks[tankid] = true;
					}
				});
                console.log(num);
				if (num === 0) {
					deviceStatus[motor].status = 'off';
					updateControlApp(io, appSockets, deviceStatus, deviceMap);
					io.sockets.connected[motor].emit('status', { status: 'off' });
				} else {
					var rate = deviceMap[motor][1].rate;
					var effectiveRate = rate / num;
					rates[motor] = effectiveRate;
				}
			}
		}
	}
	for (tankid in requestingTanks) {
		if (requestingTanks.hasOwnProperty(tankid)) {
			var motors = deviceMap[tankid][1].clients.motors;
			var rate = 0;
			var capacity = deviceMap[tankid][1].capacity;
			motors.forEach(function (motor) {
				var motorid = sockets.motors[motor._id];
				if (motorid && rates[motorid]) {
					rate += rates[motorid];
				}
			});
			(function (tankid, rate) {
				var timer = setInterval(function () {
					var level = deviceStatus[tankid].level;
					if (level + rate <= capacity) {
                        console.log(rate);
						io.sockets.connected[tankid].emit('water', { capacity: rate });
					} else {
						io.sockets.connected[tankid].emit('water', { capacity: capacity - level });
					}
				}, 1000);
				timers.push(timer);
			}(tankid, rate));
		}
	}
}

module.exports = function (socket, io, sockets, deviceMap, deviceStatus, appSockets) {
	deviceStatus[socket.id] = { status: 'off' };
	updateControlApp(io, appSockets, deviceStatus, deviceMap);

	socket.on('status', function (message) {
        console.log('hello'+message.status);
		deviceStatus[socket.id].status = message.status;
		updateControlApp(io, appSockets, deviceStatus, deviceMap);
		refreshWaterDistribution(io, sockets, deviceMap, deviceStatus, appSockets);
	});

	socket.on('get status', function () {
        console.log('getstatus');
		var tanks = deviceMap[socket.id][1].clients.tanks;
		var len = tanks.length;
		for (var i = 0; i < len; i += 1) {
			var tankSocket = sockets.tanks[tanks[i]._id];
			if (deviceStatus[tankSocket] && deviceStatus[tankSocket].status === 'on') {
				socket.emit('status', { status: 'on' });
				break;
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
		refreshWaterDistribution(io, sockets, deviceMap, deviceStatus, appSockets);
	});
};
module.exports.refreshWaterDistribution = refreshWaterDistribution;
