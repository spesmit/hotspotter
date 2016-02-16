/**
 * Created by SmithS on 01/29/2016.
 */

var async = require("async")

var Repo = require('../repository/repoModel')

var repoService = require('../repository/repoService')
var scoringService = require('./scoringService')

module.exports.score = function (req, res) {

    var repoURL = req.params.repoUrl

    repoService.retrieveRepo(repoURL, function (err, repo) {
        if (err) console.log("ERR: " + err)
        else {
            scoringService.scoringAlgorithm(repo, function (err, repo) {
                if (err) console.log("ERR: " + err)
                else res.json(repo)
            })  
        }
    })

    
}

module.exports.scoreSection = function (req, res) {

    var repoURL = req.params.repoUrl
    var sections = req.params.sections

    repoService.retrieveRepo(repoURL, function (err, repo) {
        if (err) console.log("ERR: " + err)
        else {
            scoringService.scoreSections(repo, sections, function (err, repo) {
                if (err) console.log("ERR: " + err)
                else res.json(repo)
            })
        }
    })  
}