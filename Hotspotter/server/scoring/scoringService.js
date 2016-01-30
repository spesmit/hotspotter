/**
 * Created by SmithS on 01/29/2016.
 */

async = require("async");

exports.scoringAlgorithm = function (repo, res) {
 	var min = repo.FirstModified.getTime()
 	var max = repo.LastModified.getTime()

 	async.each(repo.Files, function (file, callback) {
        var sumScore = 0
        for (var i = 0; i < file.Commits.length; i++) {
        	var commitTime = file.Commits[i].Time.getTime()
        	var t = (((commitTime-min)/(max-min)))
        	var commitScore = (1 / (1 + Math.pow(Math.E,(-12*t+12))))
        	sumScore += commitScore
        }
        file.Score = sumScore
        callback()
    },
    function (err) {
        res(repo);
    })
}

exports.normalizeScore = function(repo, res) {
 	var max = 0;
    var min = Number.MAX_VALUE;

    // Case 1 files
    if (repo.Files.length == 1) {
    	repo.Files[0].Score = 1
    	res(repo)
    } else {
    // Case 2+ files
	    for (var i = 0; i < repo.Files.length; i++) {
			var score = repo.Files[i].Score
			if (score < min) {
				min = score
			}
			if (score > max) {
				max = score
			}
	    }

		async.each(repo.Files, function (file, callback) {
	        file.Score = (1 - ((file.Score-min)/(max-min)))
	        callback()
	    },
	    function (err) {
	        res(repo);
	    })
	}
}