var mongoose = require('mongoose')
var commitSchema = require('../commit/commitModel').schema

var file = mongoose.Schema({
    Id: String,
    FullPath: String,
    Score: Number,
    LastUpdated: Date,
    Commits: [commitSchema]
})

module.exports = mongoose.model('File', file)
