/**
 * Created by SmithS on 01/29/2016.
 */

var mongoose = require('mongoose')
var diffSchema = require('../diff/diffModel').schema

module.exports = mongoose.model('Commit', {
    Time: Date,
    BugFix: Boolean,
    Hash: String,
    Author: String,
    TimeMs: Number,
    Scores : [{Score : Number, Time : Number, SnapshotTime: Number}],
    Diff : diffSchema
})
