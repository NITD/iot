var mongoose = require('mongoose');

var deviceModels = {
	lamps: mongoose.model('Lamp'),
	switchsensors: mongoose.model('SwitchSensor'),
	motors: mongoose.model('Motor'),
	tanks: mongoose.model('Tank'),
	garagedoors: mongoose.model('GarageDoor'),
	levelsensors: mongoose.model('LevelSensor'),
	fans: mongoose.model('Fan')
};

var sendJSONResponse = require('./json');

module.exports.readAllIds = function (req, res) {
	var devices = { };
	var count = 0;
	devices.err = 0;
	for (device in deviceModels) {
		if (!deviceModels.hasOwnProperty(device)) {
			continue;
		}
		(function (device) {
			devices[device] = { };
			deviceModels[device]
			.find()
			.exec(function (err, arr) {
				if (err) {
					devices.err = 1;
				} else {
					arr.forEach(function (obj) {
						devices[device][obj._id] = obj;
					});
				}
				count++;
				if (count === 7) {
					sendJSONResponse(res, 200, devices);
				}
			});
		}(device));
	}
};
