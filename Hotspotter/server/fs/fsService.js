/**
 * Created by SmithS on 03/4/2016.
 */

 var fs = require('fs')
 var del = require('delete')

 exports.removeRepoFiles = function (repoPath, callback) {
 	fs.stat(repoPath, function (err, stats) {
 		if (err) return callback(err)
 		else {
 			del([repoPath], function (err) {
 				if (err) return callback(err)
 				else return callback(null)
 			}) 
 		}
 	})
 }

 exports.extractDiff = function (filehash, callback) {
 	fs.readFile(filehash, 'utf8', function(err, data) {
 		if (err) return callback(err)
 		else {
 			fs.unlink(filehash, function (err) {
 				if (err) return callback(err)
 				else return callback(null, data)
 			})
 		}
 	})
 }