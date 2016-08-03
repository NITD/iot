var mongoose = require('mongoose');
var GarageDoor = mongoose.model('GarageDoor');
var sendJSONResponse = require('./json');

module.exports.create = function (req, res) {
	if (!req.params.garagedoorid) {
		sendJSONResponse(res, 404, {
			message: 'No garagedoorid in request'
		});
		return;
	}
	var garageDoorObj = {
		_id: req.params.garagedoorid,
		name: req.body.name
	};
	GarageDoor.create(garageDoorObj, function (err, garageDoor) {
		if (err) {
			sendJSONResponse(res, 400, err);
		} else {
			sendJSONResponse(res, 201, garageDoor);
		}
	});
};

module.exports.readOne = function (req, res) {
	if (req.params && req.params.garagedoorid) {
		GarageDoor
		.findById(req.params.garagedoorid)
		.exec(function (err, garageDoor) {
			if (!garageDoor) {
				sendJSONResponse(res, 404, {
					message: 'No garage door found with that id'
				});
				return;
			} else if (err) {
				sendJSONResponse(res, 400, err);
				return;
			}
			sendJSONResponse(res, 200, garageDoor);
		});
	} else {
		sendJSONResponse(res, 404, {
			message: 'No garagedoorid in request'
		});
	}
};

module.exports.updateOne = function (req, res) {
	if (!req.params.garagedoorid) {
		sendJSONResponse(res, 404, {
			message: 'No garagedoorid in request'
		});
		return;
	}
	GarageDoor
	.findById(req.params.garagedoorid)
	.select('-clients')
	.exec(function (err, garageDoor) {
		if (!garageDoor) {
			sendJSONResponse(res, 404, {
				message: 'No garage door found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		if (req.body._id) {
			garageDoor._id = req.body._id;
		}
		if (req.body.name) {
			garageDoor.name = req.body.name;
		}
		garageDoor.save(function (err, garageDoor) {
			if (err) {
				sendJSONResponse(res, 400, err);
			} else {
				sendJSONResponse(res, 201, garageDoor);
			}
		});
	});
};

module.exports.deleteOne = function (req, res) {
	if (!req.params.garagedoorid) {
		sendJSONResponse(res, 404, {
			message: 'No garagedoorid in request'
		});
		return;
	}
	GarageDoor
	.findByIdAndRemove(req.params.garagedoorid)
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
	if (!req.params.garagedoorid || !req.params.type) {
		sendJSONResponse(res, 404, {
			message: 'Both garagedoorid and client type are required'
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
	GarageDoor
	.findById(req.params.garagedoorid)
	.select('clients')
	.exec(function (err, garageDoor) {
		if (!garageDoor) {
			sendJSONResponse(res, 404, {
				message: 'No garage door found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		garageDoor.clients[req.params.type] = { _id: req.body.id };
		garageDoor.save(function (err, garageDoor) {
			if (err) {
				sendJSONResponse(res, 400, err);
			} else {
				sendJSONResponse(res, 201, garageDoor);
			}
		});
	});
};

module.exports.clientReadOne = function (req, res) {
	if (!req.params.garagedoorid || !req.params.type) {
		sendJSONResponse(res, 404, {
			message: 'Both garagedoorid and client type are required'
		});
		return;
	}
	if (!checkClientType(res, req.params.type)) {
		return;
	}
	GarageDoor
	.findById(req.params.garagedoorid)
	.select('clients')
	.exec(function (err, garageDoor) {
		if (!garageDoor) {
			sendJSONResponse(res, 404, {
				message: 'No garage door found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		if (garageDoor.clients[req.params.type]) {
			sendJSONResponse(res, 200, {
				_id: garageDoor.clients[req.params.type]._id
			});
		} else {
			sendJSONResponse(res, 404, {
				message: 'No client found'
			});
		}
	});
};

module.exports.clientDelete = function (req, res) {
	if (!req.params.garagedoorid || !req.params.type) {
		sendJSONResponse(res, 404, {
			message: 'Both garagedoorid and client type are required'
		});
		return;
	}
	if (!checkClientType(res, req.params.type)) {
		return;
	}
	GarageDoor
	.findById(req.params.garagedoorid)
	.select('_id clients')
	.exec(function (err, garageDoor) {
		if (!garageDoor) {
			sendJSONResponse(res, 404, {
				message: 'No garage door found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		if (garageDoor.clients[req.params.type]) {
			garageDoor.clients[req.params.type].remove();
			garageDoor.save(function (err) {
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
