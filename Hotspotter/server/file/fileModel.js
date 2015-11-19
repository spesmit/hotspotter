var mongoose = require('mongoose');

module.exports = mongoose.model('file', {
    Id: String,
    RepoId: String,
    Name: String,
    Score: Number,
    LastUpdated: Date,
    Commits: Number
});
