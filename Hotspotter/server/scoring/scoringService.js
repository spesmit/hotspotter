/**
 * Created by SmithS on 01/29/2016.
 */

async = require("async")

var scoringService = require('./scoringService')

exports.scoringAlgorithm = function (repo, options, callback) {

    // check for options
    if (typeof callback === 'undefined') {
        callback = options
        options = {}
    }

    // set up options
    if (options.To == null) options.To = repo.LastModified.getTime() 

    if (options.From == null) options.From = repo.FirstModified.getTime()

    if (options.First == null) options.First = repo.FirstModified.getTime() 

    if (options.Last == null) options.Last = repo.LastModified.getTime()

    if (options.Bug == null) options.Bug = false

    if (options.Section == null) options.Section = false

 	async.each(repo.Files, function (file, callback) {
        var sumScore = 0


        for (var i = 0; i < file.Commits.length; i++) {
            // convert data into comparable time
            var commitTime = file.Commits[i].Time.getTime()
            if (commitTime <= options.To && commitTime >= options.From) {

                if (!options.Bug || file.Commits[i].BugFix) {
                
                    // normalize time
                    var t = (((commitTime-options.First)/(options.Last-options.First)))
                    // calculate score
                    var commitScore = (1 / (1 + Math.pow(Math.E,(-12*t+12))))
                    
                    file.Commits[i].Score = commitScore
                    file.Commits[i].TimeMs = commitTime

                    sumScore += commitScore

                }
            }
        }

        // update file model with score
        file.Score = sumScore
        if (options.Section) file.Scores.push({Score: sumScore, Time: options.To})
        callback()
    },
    function (err) {
        if (err) return callback(err)
        else return callback(null, repo)
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

exports.scoreSections = function(repo, divisions, options, callback) {

    // check for options
    if (typeof callback === 'undefined') {
        callback = options
        options = {}
    }

    var sections = []
    var first = repo.FirstModified.getTime()
    var last = repo.LastModified.getTime()
    var from = first
    var frame = (last-first)/divisions
    var to = from + frame
    last = to

    for (var i = 0; i < divisions; i++) {
        sections.push({First: first, Last: last, To : to, From: from, Section: true})
        to += frame
        last += frame
    }

    async.each(sections, function (section, callback) {
        scoringService.scoringAlgorithm(repo, section, function (err, repo) {
            if (err) callback(err)
            callback()
        })
    },
    function (err) {
        if (err) return callback(err)
        return callback(null, repo)
    })

}
