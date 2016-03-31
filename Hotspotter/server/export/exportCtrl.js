var csv             = require('express-csv')
var Repo            = require('../repository/repoModel')
var repoService     = require('../repository/repoService')
var scoringService  = require('./scoringService')

module.exports.export = function (req, res) {
    var repoURL = req.params.repoUrl

    repoService.retrieveRepo(repoURL, function (err, repo) {
        if (err) console.log("ERR: " + err)
        else {
            scoringService.scoringAlgorithm(repo, function (err, repo) {
                if (err) console.log("ERR: " + err)
                else {
                    res.set('Content-Type', 'application/octet-stream');
                    res.csv(repo)
                }
            })
        }
    })

}
