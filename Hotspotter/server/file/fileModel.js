var mongoose = require('mongoose');

module.exports = mongoose.model('file', {
    Id: String,
    Name: String,
    Score: Number,
    LastUpdated: Date,

});
