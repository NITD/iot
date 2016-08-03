var fs = require('fs');

module.exports = function (socket, io, sockets, deviceMap, deviceStatus, appSockets) {
	socket.on('play', function (message) {
		var musicFile = fs.createReadStream(__dirname + '/../music/' + message.song);
		musicFile.on('error', function () {
			console.log('An error occurred with music streaming');
		});

		musicFile.on('data', function (data) {
			socket.emit('chunk', data);
		});
	});

	socket.on('get list', function () {
		fs.readdir(__dirname + '/../music', function (err, files) {
			var musicList = [];
			if (err) {
				console.log('An error occurred in getting music directory listing');
				return;
			}
			files.forEach(function (f) {
				var file = f.split('.');
				var extension = file[file.length - 1];
				if (extension == 'mp3') {
					musicList.push(f);
				}
			});
			socket.emit('list', musicList);
		});
	});
};
