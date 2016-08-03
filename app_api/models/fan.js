var mongoose = require('mongoose');

var idSchema = require('./id_schema');

var fanClientSchema = new mongoose.Schema({
	levelSensor: idSchema
});

var fanSchema = new mongoose.Schema({
	_id: { type: Number, required: true },
	name: { type: String, required: true },
	watts: Number,
	clients: { type: fanClientSchema, required: true, 'default': { } }
});

mongoose.model('Fan', fanSchema);
