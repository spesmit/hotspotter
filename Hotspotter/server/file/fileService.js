/**
 * Created by SmithS on 01/13/2016.
 */

var Repo = require('../repository/repoModel');
var File = require('./fileModel');
var async = require("async");

exports.storeFiles = function (repo, res) { 

	async.each(repo.Files, function (file, callback) {
		file.save(function(err) {
			if(err) {
				console.log(err);
			} else {
				Repo.findOne({URL:repo.URL}, function(err, result) {
					if (err) {
						console.log(err);
					} else {
						result.Files.push(file);
						result.save(function (err, result) {
							if (err) console.log(err);
						});
					}
				});
			}
		});

    	callback();
    },
    function (err) {
    	res(err);
    });
}

exports.fetchFiles = function (url, res) {
	Repo.findOne({URL:url}, function (err, results) {
       	res(results.Files);
    });
}


