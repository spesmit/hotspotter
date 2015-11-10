var mongoose = require('mongoose');

module.exports = mongoose.model('user', {
    Username: String,
    Password: String,
    LastActive: Date

});
