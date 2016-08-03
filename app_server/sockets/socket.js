var querystring = require('querystring');

module.exports = function (io) {
	var request = require('request');
	var apiOptions = { server: 'http://localhost:3000' };

	var addEvents = {
		lamp: require('./lamp'),
		switchSensor: require('./switchSensor'),
		motor: require('./motor'),
		tank: require('./tank'),
		garageDoor: require('./garageDoor'),
		levelSensor: require('./levelSensor'),
		fan: require('./fan')
	};

	var apps = {
		music: require('./music')
	};

	var sockets = {
		lamps: { },
		switchSensors: { },
		motors: { },
		tanks: { },
		garageDoors: { },
		levelSensors: { },
		fans: { }
	};
	var deviceMap = { };
	var deviceStatus = { };

	var socketBuffer = { };

	function handleConnection(socket) {
		var device = socketBuffer[socket.id];
		delete socketBuffer[socket.id];
		if (device.type === 'app') {
			if (apps[device.appType]) {
				console.log(device.appType + ' app connected');
				apps[device.appType](socket);
				socket.emit('connected', device);
			} else {
				console.log('The client trying to establish connection is not recognised');
				socket.disconnect();
			}
			return;
		}
		request({
			url: apiOptions.server + '/api/' + device.type + '/' + device.id,
			method: 'GET',
			json: { }
		}, function (err, response, body) {
			if (response.statusCode === 200) {
				console.log(device.type + ' ' + device.id + ' connected');
				sockets[device.type + 's'][device.id] = socket.id;
				deviceMap[socket.id] = [device.type, body];
				addEvents[device.type](socket, io, sockets, deviceMap, deviceStatus);
				socket.emit('connected', device);
			} else {
				console.log('The client trying to establish connection is not recognised');
				socket.disconnect();
			}
		});
	}

	io.use(function (socket, next) {
		var device = socket.handshake.query;
		if (device && device.query && typeof device.query === 'string') {
			var object = querystring.parse(device.query);
			device = object;
		}
		if (sockets[device.type + 's'] || device.type === 'app') {
			socketBuffer[socket.id] = device;
			return next();
		}
		console.log('The client trying to establish connection is not recognised');
		next(new Error('Client not recognised'));
	});

	io.on('connection', function (socket) {
		console.log('A client connected');
		handleConnection(socket);

		socket.on('disconnect', function () {
			console.log('A client disconnected');
		});
	});
};
