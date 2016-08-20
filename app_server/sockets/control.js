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
	console.log(JSON.stringify(o, null, 2));
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

	socket.on('disconnect', function () {
		var indexToRemove = appSockets.control.indexOf(socket.id);
		appSockets.control.splice(indexToRemove, 1);
	});
};
module.exports.updateControlApp = updateControlApp;
