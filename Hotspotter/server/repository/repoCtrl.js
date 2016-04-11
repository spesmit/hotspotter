var Repo = require('./repoModel')
var gitService = require('../git/gitService')
var fileService = require('../file/fileService')
var repoService = require('./repoService')
var scoringService = require('../scoring/scoringService')
var fsService = require('../fs/fsService')
var File = require('../file/fileModel')
var async = require("async")
var crypto    = require("crypto")

var sha1      = function(input) {
  return crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex')
}

module.exports.create = function (req, res) {

    var repoUrl = req.params.repoUrl;
    var repo = new Repo();
    repo.URL = repoUrl;

    gitService.gitCheckout(repoUrl, function (err) {
        if (err) { 
            console.log("ERR: " + err)
            res.json([]);
        } else {
            repoService.createRepo(repo, function (err, repo) {
                if (err) {
                    console.log("ERR: " + err)
                    res.json([])
                } else {
                    res.json(repo)
                }
            })
        }
    })    
}

module.exports.list = function (req, res) {
    repoService.listRepo(function (err, list) {
        if (err) {
            console.log("ERR: " + err)
            res.json([])
        } else {
            res.json(list)
        }
    })
}

module.exports.view = function (req, res) {
    // build file structure json object from request and return
    var repoURL     = req.params.repo
    var repoURLHash = sha1(repoURL)
    var repoPath    = "tempProjects/" + repoURLHash
    var sections    = 10


    repoService.retrieveRepo(repoURL, function (err, repo) {
        if (err) {
            console.log("ERR: " + err)
            res.json({})
        } else {
            if (repo.Files.length <= 0) {
                fileService.scanFiles(repoPath, repo, function (err, repo) {
                    if (err) {
                        console.log("ERR: " + err)
                        res.json({})
                    } else {
                        scoringService.scoreSections(repo, sections, function (err, repo) {
                            if (err) {
                                console.log("ERR: " + err)
                                res.json({})
                            } else {
                                scoringService.normalizeSection(repo, function (err, repo) {
                                    if (err) {
                                        console.log("ERR: " + err)
                                        res.json({})
                                    } else {
                                        repoService.updateRepo(repo, function (err, res) {
                                            if (err) {
                                                console.log("ERR: " + err)
                                                res.json({})
                                            } else {
                                                console.log("Files stored...")
                                            }
                                        })

                                        // create fileView tree for GUI
                                        repoService.createTree(repo.Files, function (err, tree) {
                                            if (err) {
                                                console.log("ERR: " + err)
                                                res.json({})
                                            } else {
                                                res.json(tree)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            } else {
                fileService.fetchFiles(repo.URL, function (err, files) {
                        if (err) {
                            console.log("ERR: " + err)
                            res.json({})
                        } else {
                        // create fileView tree GUI
                        repoService.createTree(files, function (err, tree) {
                            if (err) {
                                console.log("ERR: " + err)
                                res.json({})
                            } else {
                                res.json(tree)
                            }
                        })
                    }
                })
            }
        }
    }) 

}

module.exports.clear = function (req, res) {
    var repoURL = req.params.repoUrl
    var repoURLHash = sha1(repoURL)
    var repoPath    = "tempProjects/" + repoURLHash

    fsService.removeRepoFiles(repoPath, function (err) {
        if (err) {
            console.log("ERR: " + err)
            res.json([])
        } else {
            repoService.removeRepo(repoURL, function (err, repoURL) {
                if (err) {
                    console.log("ERR: " + err)
                    res.json([])
                } else {
                    res.write(JSON.stringify({ status: 'DELETED' }));
                    res.end();
                }
            })
        }
    })
}

module.exports.scan = function (req, res) {

    var repoURL     = req.params.repoUrl
    var repoURLHash = sha1(repoURL)
    var repoPath    = "tempProjects/" + repoURLHash

  
    repoService.retrieveRepo(repoURL, function (err, repo) {
        if (err) {
            console.log("ERR: " + err)
            res.json({})
        } else {
            fileService.scanFiles(repoPath, repo, function (err, repo) {
                if (err) {
                    console.log("ERR: " + err)
                    res.json({})
                } else {
                    repoService.updateRepo(repo, function (err, results) {
                        if (err) {
                            console.log("ERR: " + err)
                            res.json({})
                        } else {
                            console.log("Files stored...")
                        }
                    })
                    res.json(repo)
                }
            })
        }
    })

}


module.exports.update = function (req, res) {
    var repoURL     = req.params.repoUrl
    repoService.retrieveRepo(repoURL, function (err, repo) {
        if (err) {
            console.log("ERR: " + err)
            res.json({})
        } else {
            gitService.gitPull(repoURL, function (err, repo) {
                if (err) {
                    console.log("ERR: " + err)
                    res.json({})
                } else {
                    var status = {
                        clone: true,
                        scan: false,
                        score: false
                    }

                    repoService.updateStatus(repoURL, status, function (err) {
                        if (err) {
                            console.log("ERR: " + err)
                            res.json({})
                        } else {
                            res.json({})
                        }
                    })
                }
            })
        }
    })
}

module.exports.score = function (req, res) {
    var repoURL     = req.params.repoUrl
    var snapshots   = req.params.sections


    repoService.retrieveRepo(repoURL, function (err, repo) {
        if (err) {
            console.log("ERR: " + err)
            res.json({})
        } else {
            scoringService.scoreSections(repo, snapshots, function (err, repo) {
                if (err) {
                    console.log("ERR: " + err)
                    res.json({})
                } else {
                    scoringService.normalizeSection(repo, function (err, repo) {
                        if (err) {
                            console.log("ERR: " + err)
                            res.json({})
                        } else {
                            repoService.updateScore(repo, function (err, results) {
                                if (err) {
                                    console.log("ERR: " + err)
                                    res.json({})
                                } else {
                                    console.log("Scores stored...")
                                }
                            })
                            res.json(repo)
                        }
                    })
                }
            })
        }
    })
}