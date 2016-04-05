/**
 * Created by SmithS on 04/02/2016.
 */

var mongoose = require('mongoose')

module.exports = mongoose.model('Diff', {
	To: String,
	From: String,
	// Header @@ from-file-range to-file-range @@
    Additions: [{Content: String, Line: Number}], // lines
    Deletions: [{Content: String, Line: Number}], // lines
    NoChanges: [{Content: String, Line: Number}],
    Type: String // Remove, Add, Change, Rename
})