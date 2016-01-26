var mongoose = require('mongoose');

var file = mongoose.Schema({
    Id: String,
    FullPath: String,
    Score: Number,
    LastUpdated: Date,
    Commits: Number
});

module.exports = mongoose.model('File', file);
