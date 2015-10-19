var Repo = require('./repo_model');

module.exports.create = function (req, res) {
	var repo = new Repo(req.body);
	repo.save(function (err, result) {
		res.json(result);
	});
};

module.exports.list = function (req, res) {
    Repo.find({}, function (err, results) {
        res.json(results);
    });
};
