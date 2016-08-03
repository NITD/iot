var mongoose = require('mongoose');

var idSchema = new mongoose.Schema({
	_id: { type: Number, required: true }
});

module.exports = idSchema;
