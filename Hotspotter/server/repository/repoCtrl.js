var Repo = require('./repoModel')
var gitService = require('../git/gitService')
var fileService = require('../file/fileService')
var repoService = require('./repoService')
var scoringService = require('../scoring/scoringService')
var Glob = require('glob').Glob
var File = require('../file/fileModel')
var async = require("async")
var crypto    = require("crypto")

var sha1      = function(input) {
  return crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex');
};

module.exports.create = function (req, res) {
    var repoUrl = req.params.repoUrl;
    var repo = new Repo();
    repo.URL = repoUrl;
    // Maybe change git checkout to handle repo object and return it
    // Look are gitlogcommits
    gitService.gitCheckout(repoUrl, function (err) {
        if (err) { 
            console.log("ERR: " + err)
            res.json([]);
        } else {
            // Needs to be pushed to service
            repo.save(function (err, result) {
                res.json(result)
            })
        }
    })
    
}

module.exports.list = function (req, res) {
    Repo.find({}, function (err, results) {
        res.json(results)
    })
}

module.exports.view = function (req, res) {
    // build file structure json object from request and return
    var repoURL     = req.params.repo
    var repoURLHash = sha1(repoURL)
    var repoPath    = "tempProjects/" + repoURLHash


    Repo.findOne({ URL : repoURL }, function(err, repo) {
        // check if file metadata is in database
        if (err) {
            console.log("ERR: " + err)
            res.json({})
        } else {
            if (repo.Files.length == 0) {
                // walk files in local repo
                Glob(repoPath + "/**/*",{nodir:true}, function (err, filePaths) {
                    if (err) {
                        console.log("ERR: " + err)
                        res.json({})
                    } else {
                        // get file commits
                        gitService.gitLogCommits(repoPath, filePaths, repo, function (err, repo) {
                            scoringService.scoringAlgorithm(repo, function (err, repo) {
                                scoringService.normalizeScore(repo, function (err, repo) {

                                    // store file metadata in database
                                    // fileService.storeFiles(repo, function (err, res) {
                                    //     if (err) console.log(err)
                                    // })

                                    repoService.updateRepo(repo, function (err, res) {
                                        if (err) console.log(err)
                                    })

                                    // create fileView tree for GUI
                                    repoService.createTree(repo.Files, function (err, tree) {
                                        if (err) console.log(err)
                                        else res.json(tree)
                                    })
                                })
                            })
                        })
                    }
                })
            } else {
                // fetch file metadata from database
                fileService.fetchFiles(repo.URL, function (err, files) {
                    if (err) console.log(err)
                    else {
                        // create fileView tree GUI
                        repoService.createTree(files, function (err, tree) {
                            if (err) console.log(err)
                            else res.json(tree)
                        })
                    }
                })
            }
        }

    })
}

module.exports.clear = function (req, res) {
    var repoURL = req.params.repoUrl
    //console.log(repoURL)
    Repo.remove({URL: repoURL}, function(err, results) {
        if (err) {
            console.log("ERR: " + err)
        } else {
            console.log('\n' + repoURL + ' repo deleted... \n');
            res.write(JSON.stringify({ status: 'DELETED' }));
            res.end();
        }
    });

}

