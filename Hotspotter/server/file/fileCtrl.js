/**
 * Created by SmithS on 01/13/2016.
 */

var File = require('./fileModel');
var Repo = require('../repository/repoModel');

module.exports.list = function (req, res) {
	//console.log(req.params.listUrl);
    Repo.findOne({URL:req.params.listUrl}, function (err, results) {
    	console.log(results);
        res.json(results.Files);
    });
};

module.exports.clear = function (req, res) {
	//console.log(req.params.repoUrl);
    Repo.findOneAndUpdate(
    	{URL:req.params.repoUrl}, 
    	{$pull: {Files: {}}},
    	function(err, repo) {
			console.log('\nCleared database... \n');
		});
};

