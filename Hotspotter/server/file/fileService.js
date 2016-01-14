/**
 * Created by SmithS on 01/13/2016.
 */

var Repo = require('../repository/repoModel');
var File = require('./fileModel');
var async = require("async");

exports.storeFiles = function (files, repoID, res) { 
	//console.log(files);
	
	async.each(files, function (file, callback) {
		var file_temp = new File({
			RepoID: repoID,
			FullPath: file.FullPath,  
			Commits: file.Commits 
		});

		file_temp.save(function (err, result) {
        	if (err) console.log(err);
			else console.log('Saved : ', result, '\n');
    	});

    	callback();
    },
    function (err) {
    	res(files);
    });
}

exports.fetchFiles = function (repoID, res) {
	File.findOne({ RepoID: repoID }, function (err, results) {
       	res(results);
    });
}

exports.findRepoID = function (gitURL, res) {
	Repo.findOne({ URL: gitURL }, function (err, results) {
		console.log(results);
		res(results._id);
	});
}

