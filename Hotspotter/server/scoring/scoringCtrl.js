/**
 * Created by SmithS on 01/29/2016.
 */

var async = require("async")

var Repo = require('../repository/repoModel')

var repoService = require('../repository/repoService')
var scoringService = require('./scoringService')

module.exports.scoreSections = function (req, res) {

    var repoURL = req.params.repoUrl
    var divisions = req.query.divisions

    repoService.retrieveRepo(repoURL, function (err, repo) {
    	if (err) console.log("ERR: " + err)
        else {
            scoringService.scoreSections(repo, divisions, function (err, sections) {
                if (err) console.log("ERR: " + err)
                else res.json(sections)
            })
        }
    })

    //res.json({})
}

module.exports.score = function (req, res) {

    var repoURL = req.params.repoUrl

    repoService.retrieve(repoURL, function (err, repo) {
        if (err) console.log("ERR: " + err)
        else {
            scoringService.soringAlgorithm(repo, function (err, repo) {
                if (err) console.log("ERR: " + err)
                else res.json(repo)
            })
        }
    })

    
}