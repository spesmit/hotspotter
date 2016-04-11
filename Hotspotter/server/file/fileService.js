/**
 * Created by SmithS on 01/13/2016.
 */

var Repo = require('../repository/repoModel')
var File = require('./fileModel')
var async = require("async")
var Glob = require('glob').Glob

var gitService = require('../git/gitService')

exports.storeFile = function (repo, file, callback) { 

    Repo.findOneAndUpdate({URL:repo.URL}, {$push: {"Files": file}}, {upsert:true}, function(err, result) {
        if (err) return callback(err)
        else return callback(null, result)
    })

    // file.save(function(err) {
    // 	if(err) {
    // 		callback(err)
    // 	} else {
    // 		repo.update({URL:repo.URL}, function(err, result) {
    // 			if (err) {
    // 				callback(err)
    // 			} else {
    // 				result.Files.push(file)
    // 				result.save(function (err, result) {
    // 					if (err) callback(err)
    // 				})
    // 			}
    // 		})
    // 	}
    // }

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

    var status = {
        clone: true,
        scan: false,
        score: false
    }

	Repo.findOneAndUpdate({URL:url}, {$pull: {Files: []}, $set: {Status: status}}, {'new':true}, function(err, repo) {
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
                    repo.Status = {
                        scan: true,
                        score: false,
                        clone: true
                    }
                    console.log("Files scanned...")
                    return callback(null, repo)
                }
        	})

        }
    })
}
