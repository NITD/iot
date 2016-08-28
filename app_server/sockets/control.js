var request = require('request');
var apiOptions = { server: 'http://localhost:3000' };

function updateControlApp(io, appSockets, deviceStatus, deviceMap) {
	if (!appSockets.control.length) {
		return;
	}
	var o = { };
	for (socket in deviceStatus) {
		if (!deviceStatus.hasOwnProperty(socket)) {
			continue;
		}
		var type = deviceMap[socket][0];
		var id = deviceMap[socket][1]._id;
		if (!o[type]) {
			o[type] = { };
		}
		o[type][id] = deviceStatus[socket];
	}
	appSockets.control.forEach(function (socketid) {
		io.sockets.connected[socketid].emit('status', o);
	});
}

module.exports = function (socket, io, sockets, deviceMap, deviceStatus, appSockets) {
	appSockets.control.push(socket.id);
	updateControlApp(io, appSockets, deviceStatus, deviceMap);

	socket.on('get status', function () {
		updateControlApp(io, appSockets, deviceStatus, deviceMap);
	});

	socket.on('map update', function (msg) {
		if (msg.type === 'switchsensor') {
			msg.type = 'switchSensor';
		} else if (msg.type === 'levelsensor') {
			msg.type = 'levelSensor';
		} else if (msg.type === 'garagedoor') {
			msg.type = 'garageDoor';
		}
		request({
			url: apiOptions.server + '/api/' + msg.type + '/' + msg.id,
			method: 'GET',
			json: { }
		}, function (err, response, body) {
			if (response.statusCode == 200) {
				var devicesocket = sockets[msg.type + 's'] && sockets[msg.type + 's'][msg.id];
				if (devicesocket) {
					deviceMap[devicesocket] = [msg.type, body];
				}
			}
		});
	});

	socket.on('map delete', function (msg) {
		var devicesocket = sockets[msg.type + 's'] && sockets[msg.type + 's'][msg.id];
		if (devicesocket) {
			io.sockets.connected[devicesocket].disconnect();
		}
	});

	socket.on('disconnect', function () {
		var indexToRemove = appSockets.control.indexOf(socket.id);
		appSockets.control.splice(indexToRemove, 1);
	});
};
module.exports.updateControlApp = updateControlApp;
