var mongoose = require('mongoose');

var idSchema = require('./id_schema');

var garageDoorClientSchema = new mongoose.Schema({
	switchSensor: idSchema
});

var garageDoorSchema = new mongoose.Schema({
	_id: { type: Number, required: true },
	name: { type: String, required: true },
	clients: { type: garageDoorClientSchema, required: true, 'default': { } }
});

mongoose.model('GarageDoor', garageDoorSchema);
