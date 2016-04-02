/**
 * Created by SmithS on 01/29/2016.
 */

var mongoose = require('mongoose')

module.exports = mongoose.model('Commit', {
    Time: Date,
    BugFix: Boolean,
    Hash: String,
    Author: String,
    Score: Number,
    TimeMs: Number,
    Diff_RAW: String
})
