
var mongoose = require('mongoose');

module.exports = mongoose.model('repo', {
	url: String,
	name: String
});
