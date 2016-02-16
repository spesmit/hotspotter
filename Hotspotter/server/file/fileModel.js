var mongoose = require('mongoose')
var commitSchema = require('../commit/commitModel').schema

module.exports = mongoose.model('file', {
	Status: {Cloned: Boolean, Stored: Boolean, Scored: Boolean},
    Id: String,
    FullPath: String,
    Score: Number,
    Scores : [{Score : Number, Time : Number}],
    LastUpdated: Date,
    Commits: [commitSchema]
})
