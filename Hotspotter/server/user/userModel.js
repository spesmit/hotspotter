var mongoose = require('mongoose');

module.exports = mongoose.model('file', {
    Username: String,
    Password: String,
    LastActive: Date

});
