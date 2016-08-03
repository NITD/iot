var mongoose = require('mongoose');
var Sensor = mongoose.model('LevelSensor');
var sendJSONResponse = require('./json');

module.exports.create = function (req, res) {
	if (!req.params.levelsensorid) {
		sendJSONResponse(res, 404, {
			message: 'No levelsensorid in request'
		});
		return;
	}
	Sensor.create({
		_id: req.params.levelsensorid,
		name: req.body.name
	},
	function (err, sensor) {
		if (err) {
			sendJSONResponse(res, 400, err);
		} else {
			sendJSONResponse(res, 201, sensor);
		}
	});
};

module.exports.readOne = function (req, res) {
	if (req.params && req.params.levelsensorid) {
		Sensor
		.findById(req.params.levelsensorid)
		.exec(function (err, sensor) {
			if (!sensor) {
				sendJSONResponse(res, 404, {
					message: 'No level sensor found with that id'
				});
				return;
			} else if (err) {
				sendJSONResponse(res, 400, err);
				return;
			}
			sendJSONResponse(res, 200, sensor);
		});
	} else {
		sendJSONResponse(res, 404, {
			message: 'No levelsensorid in request'
		});
	}
};

module.exports.updateOne = function (req, res) {
	if (!req.params.levelsensorid) {
		sendJSONResponse(res, 404, {
			message: 'No levelsensorid in request'
		});
		return;
	}
	Sensor
	.findById(req.params.levelsensorid)
	.exec(function (err, sensor) {
		if (!sensor) {
			sendJSONResponse(res, 404, {
				message: 'No level sensor found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		if (req.body._id) {
			sensor._id = req.body._id;
		}
		if (req.body.name) {
			sensor.name = req.body.name;
		}
		sensor.save(function (err, sensor) {
			if (err) {
				sendJSONResponse(res, 400, err);
			} else {
				sendJSONResponse(res, 201, sensor);
			}
		});
	});
};

module.exports.deleteOne = function (req, res) {
	if (!req.params.levelsensorid) {
		sendJSONResponse(res, 404, {
			message: 'No levelsensorid in request'
		});
		return;
	}
	Sensor
	.findByIdAndRemove(req.params.levelsensorid)
	.exec(function (err) {
		if (err) {
			sendJSONResponse(res, 400, err)
		} else {
			sendJSONResponse(res, 204, null);
		}
	});
};

function checkClientType(res, type) {
	switch (type) {
		case 'fan':
			return true;
		default:
			sendJSONResponse(res, 400, {
				'message': 'Client type is not recognised'
			});
			return false;
	}
}

module.exports.clientCreate = function (req, res) {
	if (!req.params.levelsensorid || !req.params.type) {
		sendJSONResponse(res, 404, {
			message: 'Both levelsensorid and client type are required'
		});
		return;
	}
	if (!checkClientType(res, req.params.type)) {
		return;
	}
	if (!req.body.id) {
		sendJSONResponse(res, 404, {
			message: 'id is required'
		});
		return;
	}
	Sensor
	.findById(req.params.levelsensorid)
	.select('clients')
	.exec(function (err, sensor) {
		if (!sensor) {
			sendJSONResponse(res, 404, {
				message: 'No level sensor found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		if (sensor.clients[req.params.type + 's'].id(req.body.id)) {
			sendJSONResponse(res, 400, {
				message: 'The id already exists'
			});
			return;
		}
		sensor.clients[req.params.type + 's'].push({ _id: req.body.id });
		sensor.save(function (err, sensor) {
			if (err) {
				sendJSONResponse(res, 200, err);
			} else {
				sendJSONResponse(res, 201, sensor);
			}
		});
	});
};

module.exports.clientReadAll = function (req, res) {
	if (!req.params.levelsensorid || !req.params.type) {
		sendJSONResponse(res, 404, {
			message: 'Both levelsensorid and client type are required'
		});
		return;
	}
	if (!checkClientType(res, req.params.type)) {
		return;
	}
	Sensor
	.findById(req.params.levelsensorid)
	.select('clients')
	.exec(function (err, sensor) {
		if (!sensor) {
			sendJSONResponse(res, 404, {
				message: 'No level sensor found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		sendJSONResponse(res, 200, sensor.clients[req.params.type + 's']);
	});
};

module.exports.clientDeleteOne = function (req, res) {
	if (!req.params.levelsensorid || !req.params.type || !req.params.clientid) {
		sendJSONResponse(res, 404, {
			message: 'levelsensorid, client type and clientid are required'
		});
		return;
	}
	if (!checkClientType(res, req.params.type)) {
		return;
	}
	Sensor
	.findById(req.params.levelsensorid)
	.select('clients')
	.exec(function (err, sensor) {
		if (!sensor) {
			sendJSONResponse(res, 404, {
				message: 'No level sensor found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		if (sensor.clients[req.params.type + 's'].length > 0) {
			if (!sensor.clients[req.params.type + 's'].id(req.params.clientid)) {
				sendJSONResponse(res, 404, {
					message: 'clientid not found'
				});
			} else {
				sensor.clients[req.params.type + 's'].id(req.params.clientid).remove();
				sensor.save(function (err, sensor) {
					if (err) {
						sendJSONResponse(res, 200, err);
					} else {
						sendJSONResponse(res, 204, null);
					}
				});
			}
		} else {
			sendJSONResponse(res, 404, {
				message: 'No client to delete'
			});
		}
	});
};
