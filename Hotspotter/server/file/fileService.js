/**
 * Created by SmithS on 01/13/2016.
 */

var Repo = require('../repository/repoModel')
var File = require('./fileModel')
var async = require("async")

exports.storeFiles = function (repo, callback) { 

	async.each(repo.Files, function (file, callback) {
		file.save(function(err) {
			if(err) {
				callback(err)
			} else {
				Repo.findOne({URL:repo.URL}, function(err, result) {
					if (err) {
						callback(err)
					} else {
						result.Files.push(file)
						result.save(function (err, result) {
							if (err) callback(err)
						})
					}
				})
			}
		})

    	callback()
    },
    function (err) {
    	if (err) return callback(err)
        else return callback(null, repo)
    })
}

exports.fetchFiles = function (url, callback) {
	Repo.findOne({URL:url}, function (err, results) {
       	if (err) return callback(err)
        else return callback(null, results.Files)
    })
}


