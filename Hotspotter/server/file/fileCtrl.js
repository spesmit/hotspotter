/**
 * Created by SmithS on 01/13/2016.
 */

var File = require('./fileModel')
var Repo = require('../repository/repoModel')

module.exports.list = function (req, res) {
    Repo.findOne({URL:req.params.repoUrl}, 'Files', function (err, results) {
        if (err) {
            console.log("ERR: " + err)
        } else {
            res.json(results.Files)
        }
    })
}

module.exports.clear = function (req, res) {
    Repo.findOneAndUpdate(
    	{URL:req.params.repoUrl},
    	{$pull: {Files: {}}},
    	function(err, repo) {
            if (err) {
                console.log("ERR: " + err)
            } else {
		        console.log('\n' + repo.URL + ' files removed... \n')
            }
		})
}
