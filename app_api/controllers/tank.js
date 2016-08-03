var mongoose = require('mongoose');
var Tank = mongoose.model('Tank');
var sendJSONResponse = require('./json');

module.exports.create = function (req, res) {
	if (!req.params.tankid) {
		sendJSONResponse(res, 404, {
			message: 'No tankid in request'
		});
		return;
	}
	var tankObj = {
		_id: req.params.tankid,
		name: req.body.name,
		capacity: req.body.capacity
	};
	Tank.create(tankObj, function (err, tank) {
		if (err) {
			sendJSONResponse(res, 400, err);
		} else {
			sendJSONResponse(res, 201, tank);
		}
	});
};

module.exports.readOne = function (req, res) {
	if (req.params && req.params.tankid) {
		Tank
		.findById(req.params.tankid)
		.exec(function (err, tank) {
			if (!tank) {
				sendJSONResponse(res, 404, {
					message: 'No tank found with that id'
				});
				return;
			} else if (err) {
				sendJSONResponse(res, 400, err);
				return;
			}
			sendJSONResponse(res, 200, tank);
		});
	} else {
		sendJSONResponse(res, 404, {
			message: 'No tankid in request'
		});
	}
};

module.exports.updateOne = function (req, res) {
	if (!req.params.tankid) {
		sendJSONResponse(res, 404, {
			message: 'No tankid in request'
		});
		return;
	}
	Tank
	.findById(req.params.tankid)
	.exec(function (err, tank) {
		if (!tank) {
			sendJSONResponse(res, 404, {
				message: 'No tank found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		if (req.body._id) {
			tank._id = req.body._id;
		}
		if (req.body.name) {
			tank.name = req.body.name;
		}
		if (req.body.capacity) {
			tank.capacity = req.body.capacity;
		}
		tank.save(function (err, tank) {
			if (err) {
				sendJSONResponse(res, 400, err);
			} else {
				sendJSONResponse(res, 201, tank);
			}
		});
	});
};

module.exports.deleteOne = function (req, res) {
	if (!req.params.tankid) {
		sendJSONResponse(res, 404, {
			message: 'No tankid in request'
		});
		return;
	}
	Tank
	.findByIdAndRemove(req.params.tankid)
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
		case 'motor':
			return true;
		default:
			sendJSONResponse(res, 400, {
				'message': 'Client type is not recognised'
			});
			return false;
	}
}

module.exports.clientCreate = function (req, res) {
	if (!req.params.tankid || !req.params.type) {
		sendJSONResponse(res, 404, {
			message: 'Both tankid and client type are required'
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
	Tank
	.findById(req.params.tankid)
	.select('clients')
	.exec(function (err, tank) {
		if (!tank) {
			sendJSONResponse(res, 404, {
				message: 'No tank found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		if (tank.clients[req.params.type + 's'].id(req.body.id)) {
			sendJSONResponse(res, 400, {
				message: 'The id already exists'
			});
			return;
		}
		tank.clients[req.params.type + 's'].push({ _id: req.body.id });
		tank.save(function (err, tank) {
			if (err) {
				sendJSONResponse(res, 200, err);
			} else {
				sendJSONResponse(res, 201, tank);
			}
		});
	});
};

module.exports.clientReadAll = function (req, res) {
	if (!req.params.tankid || !req.params.type) {
		sendJSONResponse(res, 404, {
			message: 'Both tankid and client type are required'
		});
		return;
	}
	if (!checkClientType(res, req.params.type)) {
		return;
	}
	Tank
	.findById(req.params.tankid)
	.select('clients')
	.exec(function (err, tank) {
		if (!tank) {
			sendJSONResponse(res, 404, {
				message: 'No tank found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		sendJSONResponse(res, 200, tank.clients[req.params.type + 's']);
	});
};

module.exports.clientDeleteOne = function (req, res) {
	if (!req.params.tankid || !req.params.type || !req.params.clientid) {
		sendJSONResponse(res, 404, {
			message: 'tankid, client type and clientid are required'
		});
		return;
	}
	if (!checkClientType(res, req.params.type)) {
		return;
	}
	Tank
	.findById(req.params.tankid)
	.select('clients')
	.exec(function (err, tank) {
		if (!tank) {
			sendJSONResponse(res, 404, {
				message: 'No tank found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		if (tank.clients[req.params.type + 's'].length > 0) {
			if (!tank.clients[req.params.type + 's'].id(req.params.clientid)) {
				sendJSONResponse(res, 404, {
					message: 'clientid not found'
				});
			} else {
				tank.clients[req.params.type + 's'].id(req.params.clientid).remove();
				tank.save(function (err) {
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
