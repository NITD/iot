var mongoose = require('mongoose');

var idSchema = require('./id_schema');

var tankClientSchema = new mongoose.Schema({
	motors: [idSchema]
});

var tankSchema = new mongoose.Schema({
	_id: { type: Number, required: true },
	name: { type: String, required: true },
	capacity: { type: Number, required: true },
	clients: { type: tankClientSchema, required: true, 'default': { motors: [] } }
});

mongoose.model('Tank', tankSchema);
