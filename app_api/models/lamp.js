var mongoose = require('mongoose');

var lampSchema = new mongoose.Schema({
	name: { type: String, required: true },
	watts: Number
});

mongoose.model('Lamp', lampSchema);
