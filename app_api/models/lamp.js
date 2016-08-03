var mongoose = require('mongoose');

var idSchema = require('./id_schema');

var lampClientSchema = new mongoose.Schema({
	switchSensor: idSchema
});

var lampSchema = new mongoose.Schema({
	_id: { type: Number, required: true },
	name: { type: String, required: true },
	watts: Number,
	clients: { type: lampClientSchema, required: true, 'default': { } }
});

mongoose.model('Lamp', lampSchema);
