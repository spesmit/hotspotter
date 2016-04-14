/**
 * Created by SmithS on 04/02/2016.
 */

var mongoose = require('mongoose')

module.exports = mongoose.model('Diff', {
	To: String,
	From: String,
	// Header @@ from-file-range to-file-range @@
    Additions: [{Content: String}], // lines
    Deletions: [{Content: String}], // lines
    //NoChanges: [String],
    Type: String // Remove, Add, Change, Rename
})