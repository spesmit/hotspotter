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
    if (options.Section == null) {
        options.Section = [{
            To : repo.LastModified.getTime(),     // End time for section
            From : repo.FirstModified.getTime(),  // Start time for section
            First : repo.FirstModified.getTime(), // Time of first commit
            Last : repo.LastModified.getTime()    // Time of lastest commit
        }]
    }

    if (options.Bug == null) options.Bug = false


 	async.each(repo.Files, function (file, callback) {
        var sumScore = []
        // reset score data
        file.Scores = []

        for (var i = 0; i <options.Section.length; i++) {
            sumScore.push(0)   
        }

        for (var i = 0; i < file.Commits.length; i++) {
            // convert data into comparable time
            var commitTime = file.Commits[i].Time.getTime()
            for (var j = 0; j < options.Section.length; j++) {

                if (commitTime <= options.Section[j].To && commitTime >= options.Section[j].From) {

                    if (!options.Bug || file.Commits[i].BugFix) {
                    
                        // normalize time
                        var t = (((commitTime-options.Section[j].First)/(options.Section[j].Last-options.Section[j].First)))
                        // calculate score
                        var commitScore = (1 / (1 + Math.pow(Math.E,(-12*t+12))))
                        
                        file.Commits[i].Score = commitScore
                        file.Commits[i].TimeMs = commitTime

                        sumScore[j] += commitScore

                    }
                }
            }
        }

        // update file model with score
        file.Score = sumScore[0]
        for (var i = 0; i < sumScore.length; i++) {
            file.Scores.push({Score: sumScore[i], Time: options.Section[i].To})
        }
       
        callback()
    },
    function (err) {
        if (err) return callback(err)
        else return callback(null, repo)
    })
}

exports.normalizeScore = function(repo, options, callback) {
 	
    // check for options
    if (typeof callback === 'undefined') {
        callback = options
        options = {}
    }

    if (options.Offset == null) options.Offset = 1 

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
            if (options.Offset) file.Score = (1 - ((file.Score-min)/(max-min)))
            else file.Score = ((file.Score-min)/(max-min))
	        callback()
	    },
	    function (err) {
	        if (err) return callback(err)
            else return callback(null, repo)
	    })
	}
}

exports.normalizeSection = function(repo, options, callback) {

    // check for options
    if (typeof callback === 'undefined') {
        callback = options
        options = {}
    }

    if (options.Offset == null) options.Offset = 1 

    var max = []
    var min = []

    // Case 0 files or undefined
    if (repo.Files == null || repo.Files.length == 0) {
        return callback("No repo files or undefined")
    }

     for (var i = 0; i < repo.Files[0].Scores.length; i++) {
        max[i] = 0
        min[i] = Number.MAX_VALUE
    }

    // Case 1 files
    if (repo.Files.length == 1) {
        for (var i = 0; i < repo.Files[0].Scores.length; i++) {
            repo.Files[0].Scores[i].Score = 1
        }

        return callback(null, repo)
    } else {
    // Case 2+ files
        for (var j = 0; j < repo.Files.length; j++) {
            for (var i = 0; i < repo.Files[j].Scores.length; i++) {
                var score = repo.Files[j].Scores[i].Score
                if (score < min[i]) {
                    min[i] = score
                }
                if (score > max[i]) {
                    max[i] = score
                }
            }
        }
        // normalize values for front end api
        async.each(repo.Files, function (file, callback) {
            for (var i = 0; i < file.Scores.length; i++) {
                if (options.Offset) file.Scores[i].Score = (1 - ((file.Scores[i].Score-min[i])/(max[i]-min[i])))
                else file.Scores[i].Score = ((file.Scores[i].Score-min[i])/(max[i]-min[i]))
            }
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

    var opt = {Section : sections} 

    scoringService.scoringAlgorithm(repo, opt, function (err, repo) {
        if (err) return callback(err)
        return callback(null, repo)
    })
}
