var Repo = require('./repo_model');
var Git = require('../git/gitService');
var Glob = require('glob').Glob;
var File = require('../file/fileModel');

module.exports.create = function (gitUrl, res) {
	var repo = new Repo(gitUrl.body);
	Git.gitCheckout(repo.URL);
	repo.save(function (err, result) {
		res.json(result);
	});
};

module.exports.list = function (req, res) {
    Repo.find({}, function (err, results) {
        res.json(results);
    });
};

module.exports.view = function (req, res) {
	// build file structure json object from request and return
	var repoUrl = req.params.repo;


	//Glob("tempProjects/" + repoUrl + "/**/*.*", function (err, files) {
	Glob("tempProjects/**/*.*", function (err, filePaths) {
		
		if(err) {
			console.log("ERR: " + err);
			res.json([]);
		} else {
			var files = [];
			for(var i = 0, len = filePaths.length; i < len; i++) {
				Git.gitLogCommits(filePaths[i], function (commits, filepath) {					
					files.push(new File({
						Name: filepath,
						Commits: commits
					}));
					//console.log(files);
				});
				
			}
			res.json(files);
			//console.log(files);
	  	}
	});
};
