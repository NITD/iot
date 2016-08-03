var mongoose = require('mongoose');

var idSchema = require('./id_schema');

var switchSensorClientSchema = new mongoose.Schema({
	lamps: [idSchema],
	garageDoors: [idSchema]
});

var switchSensorSchema = new mongoose.Schema({
	_id: { type: Number, required: true },
	name: { type: String, required: true },
	clients: { type: switchSensorClientSchema, required: true, 'default': { lamps: [], garageDoors: [] } }
});

mongoose.model('SwitchSensor', switchSensorSchema);
