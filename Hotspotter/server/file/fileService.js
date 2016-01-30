/**
 * Created by SmithS on 01/13/2016.
 */

var Repo = require('../repository/repoModel');
var File = require('./fileModel');
var async = require("async");

exports.storeFiles = function (files, url, res) { 
	//console.log(files);
	
	async.each(files, function (file, callback) {
		var file_temp = new File({
			FullPath: file.FullPath,  
			Commits: file.Commits 
		});
		file_temp.save(function(err) {
			if(err) {
				console.log(err);
			} else {
				Repo.findOne({URL:url}, function(err, repo) {
					if (err) {
						console.log(err);
					} else {
						repo.Files.push(file_temp);
						repo.save(function (err, result) {
							if (err) console.log(err);
						 	//else console.log('Saved : ', result, '\n');
						});
					}
				});
			}
		});

		// file_temp.save(function (err, result) {
  //       	if (err) console.log(err);
		// 	else console.log('Saved : ', result, '\n');
  //   	});

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


