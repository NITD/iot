var mongoose = require('mongoose');

var idSchema = require('./id_schema');

var motorClientSchema = new mongoose.Schema({
	tanks: [idSchema]
});

var motorSchema = new mongoose.Schema({
	_id: { type: Number, required: true },
	name: { type: String, required: true },
	rate: { type: Number, required: true },
	watts: Number,
	clients: { type: motorClientSchema, required: true, 'default': { tanks: [] } }
});

mongoose.model('Motor', motorSchema);
