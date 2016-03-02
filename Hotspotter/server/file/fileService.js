/**
 * Created by SmithS on 01/13/2016.
 */

var Repo = require('../repository/repoModel')
var File = require('./fileModel')
var async = require("async")
var Glob = require('glob').Glob

var gitService = require('../git/gitService')

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

exports.listFiles = function (url, callback) {

	Repo.findOne({URL:url}, 'Files', function (err, files) {
        if (err) return	callback(err)
        if (files) return callback(null, files.Files)
        else return callback("Repo not found")
    })

}

exports.removeFiles = function (url, callback) {

	Repo.findOneAndUpdate({URL:url}, {$pull: {Files: {}}}, function(err, repo) {
        if (err) return callback(err)
        if (repo) return callback(null, repo)
        else return callback("Repo not found")
	})
}

exports.scanFiles = function (repoPath, repo, callback) {

	Glob(repoPath + "/**/*",{nodir:true}, function (err, filePaths) {
        if (err) return callback(err)
        else {
            // get file commits
            gitService.gitLogCommits(repoPath, filePaths, repo, function (err, repo) {
                if (err) return callback(err)
                else {
                	console.log("Files scanned...")
                	return callback(null, repo)
                }
        	})
        }
    })
}
