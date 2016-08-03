var mongoose = require('mongoose');

var idSchema = require('./id_schema');

var levelSensorClientSchema = new mongoose.Schema({
	fans: [idSchema],
});

var levelSensorSchema = new mongoose.Schema({
	_id: { type: Number, required: true },
	name: { type: String, required: true },
	clients: { type: levelSensorClientSchema, required: true, 'default': { fans: [] } }
});

mongoose.model('LevelSensor', levelSensorSchema);
