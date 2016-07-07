var mongoose = require('mongoose');

var switchSensorSchema = new mongoose.Schema({
	name: { type: String, required: true },
});

mongoose.model('SwitchSensor', switchSensorSchema);
