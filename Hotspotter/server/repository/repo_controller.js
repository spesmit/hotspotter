var Repo = require('./repo_model');
var Git = require('../git/gitService');
var Glob = require('glob');

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
	var repoID = req.params.repo;
	Glob("tempProjects/" + repoID + "/**/*", function (err, files) {
		if(err) {
			console.log("ERR: " + err);
			res.json([]);
		} else {
	  		res.json(files);
	  	}
	});
};
