var mongoose = require('mongoose');
var Fan = mongoose.model('Fan');
var sendJSONResponse = require('./json');

module.exports.create = function (req, res) {
	if (!req.params.fanid) {
		sendJSONResponse(res, 404, {
			message: 'No fanid in request'
		});
		return;
	}
	var fanObj = {
		_id: req.params.fanid,
		name: req.body.name
	};
	if (req.body.watts) {
		fanObj.watts = parseInt(req.body.watts, 10);
	}
	Fan.create(fanObj, function (err, fan) {
		if (err) {
			sendJSONResponse(res, 400, err);
		} else {
			sendJSONResponse(res, 201, fan);
		}
	});
};

module.exports.readOne = function (req, res) {
	if (req.params && req.params.fanid) {
		Fan
		.findById(req.params.fanid)
		.exec(function (err, fan) {
			if (!fan) {
				sendJSONResponse(res, 404, {
					message: 'No fan found with that id'
				});
				return;
			} else if (err) {
				sendJSONResponse(res, 400, err);
				return;
			}
			sendJSONResponse(res, 200, fan);
		});
	} else {
		sendJSONResponse(res, 404, {
			message: 'No fanid in request'
		});
	}
};

module.exports.updateOne = function (req, res) {
	if (!req.params.fanid) {
		sendJSONResponse(res, 404, {
			message: 'No fanid in request'
		});
		return;
	}
	Fan
	.findById(req.params.fanid)
	.select('-clients')
	.exec(function (err, fan) {
		if (!fan) {
			sendJSONResponse(res, 404, {
				message: 'No fan found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		if (req.body._id) {
			fan._id = req.body._id;
		}
		if (req.body.name) {
			fan.name = req.body.name;
		}
		if (req.body.watts) {
			fan.watts = req.body.watts;
		}
		fan.save(function (err, fan) {
			if (err) {
				sendJSONResponse(res, 400, err);
			} else {
				sendJSONResponse(res, 201, fan);
			}
		});
	});
};

module.exports.deleteOne = function (req, res) {
	if (!req.params.fanid) {
		sendJSONResponse(res, 404, {
			message: 'No fanid in request'
		});
		return;
	}
	Fan
	.findByIdAndRemove(req.params.fanid)
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
		case 'levelSensor':
			return true;
		default:
			sendJSONResponse(res, 400, {
				'message': 'Client type is not recognised'
			});
			return false;
	}
}

module.exports.clientCreate = function (req, res) {
	if (!req.params.fanid || !req.params.type) {
		sendJSONResponse(res, 404, {
			message: 'Both fanid and client type are required'
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
	Fan
	.findById(req.params.fanid)
	.select('clients')
	.exec(function (err, fan) {
		if (!fan) {
			sendJSONResponse(res, 404, {
				message: 'No fan found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		fan.clients[req.params.type] = { _id: req.body.id };
		fan.save(function (err, fan) {
			if (err) {
				sendJSONResponse(res, 400, err);
			} else {
				sendJSONResponse(res, 201, fan);
			}
		});
	});
};

module.exports.clientReadOne = function (req, res) {
	if (!req.params.fanid || !req.params.type) {
		sendJSONResponse(res, 404, {
			message: 'Both fanid and client type are required'
		});
		return;
	}
	if (!checkClientType(res, req.params.type)) {
		return;
	}
	Fan
	.findById(req.params.fanid)
	.select('clients')
	.exec(function (err, fan) {
		if (!fan) {
			sendJSONResponse(res, 404, {
				message: 'No fan found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		if (fan.clients[req.params.type]) {
			sendJSONResponse(res, 200, {
				_id: fan.clients[req.params.type]._id
			});
		} else {
			sendJSONResponse(res, 404, {
				message: 'No client found'
			});
		}
	});
};

module.exports.clientDelete = function (req, res) {
	if (!req.params.fanid || !req.params.type) {
		sendJSONResponse(res, 404, {
			message: 'Both fanid and client type are required'
		});
		return;
	}
	if (!checkClientType(res, req.params.type)) {
		return;
	}
	Fan
	.findById(req.params.fanid)
	.select('_id clients')
	.exec(function (err, fan) {
		if (!fan) {
			sendJSONResponse(res, 404, {
				message: 'No fan found with that id'
			});
			return;
		} else if (err) {
			sendJSONResponse(res, 400, err);
			return;
		}
		if (fan.clients[req.params.type]) {
			fan.clients[req.params.type].remove();
			fan.save(function (err) {
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
