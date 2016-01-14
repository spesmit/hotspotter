var mongoose = require('mongoose');

module.exports = mongoose.model('file', {
    Id: String,
    RepoId: String,
    FullPath: String,
    Score: Number,
    LastUpdated: Date,
    Commits: Number
});
