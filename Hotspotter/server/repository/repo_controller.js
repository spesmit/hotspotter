var Repo = require('./repo_model');
var Git = require('../git/gitService');
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

