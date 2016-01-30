
var mongoose = require('mongoose');
var fileSchema = require('../file/fileModel').schema;

module.exports = mongoose.model('repo', {
	FirstModified: Date,
	LastModified: Date,
	URL: String,
	Id: String,
	FileCount: Number,
	LastUpdated: Date,
	ProjectOwner: String,
	Files: [fileSchema]
});
