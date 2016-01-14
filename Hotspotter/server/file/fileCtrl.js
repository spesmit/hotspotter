/**
 * Created by SmithS on 01/13/2016.
 */

var File = require('./fileModel')

module.exports.list = function (req, res) {
    File.find({}, function (err, results) {
    	//console.log(results);
        res.json(results);
    });
};

module.exports.clear = function (req, res) {
    File.remove({}, function(err) {
		console.log('\nCleared database... \n');
	});
};