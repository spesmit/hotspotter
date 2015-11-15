
var mongoose = require('mongoose');

module.exports = mongoose.model('repo', {
	URL: String,
	Id: String,
	FileCount: Number,
	LastUpdated: Date,
	ProjectOwner: String

});
