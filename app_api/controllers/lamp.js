var mongoose = require('mongoose');
var Lamp = mongoose.model('Lamp');
var sendJSONResponse = require('./json');

module.exports.create = function (req, res) {
	if (!req.params.lampid) {
		sendJSONResponse(res, 404, {
			message: 'No lampid in request'
		});
		return;
	}
	var lampObj = {
		_id: req.params.lampid,
		name: req.body.name
	};
	if (req.body.watts) {
		lampObj.watts = parseInt(req.body.watts, 10);
	}
	Lamp.create(lampObj, function (err, lamp) {
		if (err) {
			sendJSONResponse(res, 400, err);
		} else {
			sendJSONResponse(res, 201, lamp);
		}
	});
};

module.exports.readOne = function (req, res) {
	if (req.params && req.params.lampid) {
		Lamp
		.findById(req.params.lampid)
		.exec(function (err, lamp) {
			if (!lamp) {
				sendJSONResponse(res, 404, {
					message: 'No lamp found with that id'
				});
				return;
			} else if (err) {
				sendJSONResponse(res, 400, err);
				return;
			}
			sendJSONResponse(res, 200, lamp);
		});
	} else {
		sendJSONResponse(res, 404, {
			message: 'No lampid in request'
		});
	}
};

module.exports.updateOne = function (req, res) {
	if (!req.params.lampid) {
		sendJSONResponse(res, 404, {
			message: 'No lampid in request'
		});
		return;
	}
	Lamp
	.findById(req.params.lampid)
	.select('-clients')
	.exec(function (err, lamp) {
		if (!lamp) {
			sendJSONResponse(res, 404, {
				message: 'No lamp found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		if (req.body._id) {
			lamp._id = req.body._id;
		}
		if (req.body.name) {
			lamp.name = req.body.name;
		}
		if (req.body.watts) {
			lamp.watts = req.body.watts;
		}
		lamp.save(function (err, lamp) {
			if (err) {
				sendJSONResponse(res, 400, err);
			} else {
				sendJSONResponse(res, 201, lamp);
			}
		});
	});
};

module.exports.deleteOne = function (req, res) {
	if (!req.params.lampid) {
		sendJSONResponse(res, 404, {
			message: 'No lampid in request'
		});
		return;
	}
	Lamp
	.findByIdAndRemove(req.params.lampid)
	.exec(function (err) {
		if (err) {
			sendJSONResponse(res, 400, err);
		} else {
			sendJSONResponse(res, 204, null);
		}
	});
};

function checkClientType(res, type) {
	switch (type) {
		case 'switchSensor':
			return true;
		default:
			sendJSONResponse(res, 400, {
				'message': 'Client type is not recognised'
			});
			return false;
	}
}

module.exports.clientCreate = function (req, res) {
	if (!req.params.lampid || !req.params.type) {
		sendJSONResponse(res, 404, {
			message: 'Both lampid and client type are required'
		});
		return;
	}
	if (!req.body.id) {
		sendJSONResponse(res, 404, {
			message: 'id is required'
		});
	}
	if (!checkClientType(res, req.params.type)) {
		return;
	}
	Lamp
	.findById(req.params.lampid)
	.select('clients')
	.exec(function (err, lamp) {
		if (!lamp) {
			sendJSONResponse(res, 404, {
				message: 'No lamp found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		lamp.clients[req.params.type] = { _id: req.body.id };
		lamp.save(function (err, lamp) {
			if (err) {
				sendJSONResponse(res, 400, err);
			} else {
				sendJSONResponse(res, 201, lamp);
			}
		});
	});
};

module.exports.clientReadOne = function (req, res) {
	if (!req.params.lampid || !req.params.type) {
		sendJSONResponse(res, 404, {
			message: 'Both lampid and client type are required'
		});
		return;
	}
	if (!checkClientType(res, req.params.type)) {
		return;
	}
	Lamp
	.findById(req.params.lampid)
	.select('clients')
	.exec(function (err, lamp) {
		if (!lamp) {
			sendJSONResponse(res, 404, {
				message: 'No lamp found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		if (lamp.clients[req.params.type]) {
			sendJSONResponse(res, 200, {
				_id: lamp.clients[req.params.type]._id
			});
		} else {
			sendJSONResponse(res, 404, {
				message: 'No client found'
			});
		}
	});
};

module.exports.clientDelete = function (req, res) {
	if (!req.params.lampid || !req.params.type) {
		sendJSONResponse(res, 404, {
			message: 'Both lampid and client type are required'
		});
		return;
	}
	if (!checkClientType(res, req.params.type)) {
		return;
	}
	Lamp
	.findById(req.params.lampid)
	.select('_id clients')
	.exec(function (err, lamp) {
		if (!lamp) {
			sendJSONResponse(res, 404, {
				message: 'No lamp found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		if (lamp.clients[req.params.type]) {
			lamp.clients[req.params.type].remove();
			lamp.save(function (err) {
				if (err) {
					sendJSONResponse(res, 400, err);
				} else {
					sendJSONResponse(res, 204, null);
				}
			});
		} else {
			sendJSONResponse(res, 404, {
				message: 'No client to delete'
			});
		}
	});
};
