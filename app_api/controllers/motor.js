var mongoose = require('mongoose');
var Motor = mongoose.model('Motor');
var sendJSONResponse = require('./json');

module.exports.create = function (req, res) {
	if (!req.params.motorid) {
		sendJSONResponse(res, 404, {
			message: 'No motorid in request'
		});
		return;
	}
	var motorObj = {
		_id: req.params.motorid,
		name: req.body.name,
		rate: req.body.rate
	};
	if (req.body.watts) {
		motorObj.watts = req.body.watts;
	}
	Motor.create(motorObj, function (err, motor) {
		if (err) {
			sendJSONResponse(res, 400, err);
		} else {
			sendJSONResponse(res, 201, motor);
		}
	});
};

module.exports.readOne = function (req, res) {
	if (req.params && req.params.motorid) {
		Motor
		.findById(req.params.motorid)
		.exec(function (err, motor) {
			if (!motor) {
				sendJSONResponse(res, 404, {
					message: 'No motor found with that id'
				});
				return;
			} else if (err) {
				sendJSONResponse(res, 400, err);
				return;
			}
			sendJSONResponse(res, 200, motor);
		});
	} else {
		sendJSONResponse(res, 404, {
			message: 'No motorid in request'
		});
	}
};

module.exports.updateOne = function (req, res) {
	if (!req.params.motorid) {
		sendJSONResponse(res, 404, {
			message: 'No motorid in request'
		});
		return;
	}
	Motor
	.findById(req.params.motorid)
	.exec(function (err, motor) {
		if (!motor) {
			sendJSONResponse(res, 404, {
				message: 'No motor found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		if (req.body._id) {
			motor._id = req.body._id;
		}
		if (req.body.name) {
			motor.name = req.body.name;
		}
		if (req.body.rate) {
			motor.rate = req.body.rate;
		}
		if (req.body.watts) {
			motor.watts = req.body.watts;
		}
		motor.save(function (err, motor) {
			if (err) {
				sendJSONResponse(res, 400, err);
			} else {
				sendJSONResponse(res, 201, motor);
			}
		});
	});
};

module.exports.deleteOne = function (req, res) {
	if (!req.params.motorid) {
		sendJSONResponse(res, 404, {
			message: 'No motorid in request'
		});
		return;
	}
	Motor
	.findByIdAndRemove(req.params.motorid)
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
		case 'tank':
			return true;
		default:
			sendJSONResponse(res, 400, {
				'message': 'Client type is not recognised'
			});
			return false;
	}
}

module.exports.clientCreate = function (req, res) {
	if (!req.params.motorid || !req.params.type) {
		sendJSONResponse(res, 404, {
			message: 'Both motorid and client type are required'
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
	Motor
	.findById(req.params.motorid)
	.select('clients')
	.exec(function (err, motor) {
		if (!motor) {
			sendJSONResponse(res, 404, {
				message: 'No motor found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		if (motor.clients[req.params.type + 's'].id(req.body.id)) {
			sendJSONResponse(res, 400, {
				message: 'The id already exists'
			});
			return;
		}
		motor.clients[req.params.type + 's'].push({ _id: req.body.id });
		motor.save(function (err, motor) {
			if (err) {
				sendJSONResponse(res, 200, err);
			} else {
				sendJSONResponse(res, 201, motor);
			}
		});
	});
};

module.exports.clientReadAll = function (req, res) {
	if (!req.params.motorid || !req.params.type) {
		sendJSONResponse(res, 404, {
			message: 'Both motorid and client type are required'
		});
		return;
	}
	if (!checkClientType(res, req.params.type)) {
		return;
	}
	Motor
	.findById(req.params.motorid)
	.select('clients')
	.exec(function (err, motor) {
		if (!motor) {
			sendJSONResponse(res, 404, {
				message: 'No motor found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		sendJSONResponse(res, 200, motor.clients[req.params.type + 's']);
	});
};

module.exports.clientDeleteOne = function (req, res) {
	if (!req.params.motorid || !req.params.type || !req.params.clientid) {
		sendJSONResponse(res, 404, {
			message: 'motorid, client type and clientid are required'
		});
		return;
	}
	if (!checkClientType(res, req.params.type)) {
		return;
	}
	Motor
	.findById(req.params.motorid)
	.select('clients')
	.exec(function (err, motor) {
		if (!motor) {
			sendJSONResponse(res, 404, {
				message: 'No motor found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		if (motor.clients[req.params.type + 's'].length > 0) {
			if (!motor.clients[req.params.type + 's'].id(req.params.clientid)) {
				sendJSONResponse(res, 404, {
					message: 'clientid not found'
				});
			} else {
				motor.clients[req.params.type + 's'].id(req.params.clientid).remove();
				motor.save(function (err) {
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
