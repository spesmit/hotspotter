/**
 * Created by SmithS on 01/29/2016.
 */

async = require("async")

exports.scoringAlgorithm = function (repo, options, callback) {

    // check for options
    if (typeof callback === 'undefined') {
        callback = options
    }

    // set up options
    if (options.To == null) options.To = repo.LastModified.getTime() 
    else options.To = options.To

    if (options.From == null) options.From = repo.FirstModified.getTime()
    else options.From = options.From

    if (options.Bug == null) options.Bug = false
    else options.Bug = options.Bug    

 	async.each(repo.Files, function (file, callback) {
        var sumScore = 0

        for (var i = 0; i < file.Commits.length; i++) {
            // convert data into comparable time
            var commitTime = file.Commits[i].Time.getTime()
            if (commitTime < options.To && commitTime > options.From) {

                if (options.Bug && !file.Commits[i].BugFix) {continue}
                
                // normalize time
                var t = (((commitTime-options.From)/(options.To-options.From)))
                // calculate score
                var commitScore = (1 / (1 + Math.pow(Math.E,(-12*t+12))))
                
                sumScore += commitScore

            }
        }

        // update file model with score
        file.Score = sumScore
        callback()
    },
    function (err) {
        if (err) callback(err)
        else callback(null, repo)
    })
}

exports.normalizeScore = function(repo, callback) {
 	var max = 0
    var min = Number.MAX_VALUE

    // Case 0 files or undefined
    if (repo.Files == null || repo.Files.length == 0) {
        return callback("No repo files or undefined")
    }

    // Case 1 files
    if (repo.Files.length == 1) {
    	repo.Files[0].Score = 1
    	return callback(null, repo)
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
	    // normalize values for front end api
		async.each(repo.Files, function (file, callback) {
	        file.Score = (1 - ((file.Score-min)/(max-min)))
	        callback()
	    },
	    function (err) {
	        if (err) callback(err)
            else callback(null, repo)
	    })
	}
}