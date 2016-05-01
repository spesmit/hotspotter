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
    var repoURLHash = sha1(repoUrl)
    var repoPath    = "tempProjects/" + repoURLHash

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
                    scanFiles(repo, repoPath, function (err, repo) {
                         if (err) console.log("ERR: " + err)
                    })
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
    var snapshots    = 10


    repoService.retrieveRepo(repoURL, function (err, repo) {
        if (err) {
            console.log("ERR: " + err)
            res.json({})
        } else {
            if (repo.Status.scan == -1) {
                scanFiles(repo, repoPath, function (err, repo) {
                    if (err) {
                        console.log("ERR: " + err)
                        res.json({})
                    } else {
                        scoreFiles(repo, snapshots, function (err, repo) {
                            if (err) {
                                console.log("ERR: " + err)
                                res.json({})
                            } else { 
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
            } else {
                fileService.fetchFiles(repo.URL, function (err, files) {
                    if (err) {
                        console.log("ERR: " + err)
                        res.json({})
                    } else {
                        if (repo.Status.score == 1) {
                        // create fileView tree GUI
                            repoService.createTree(files, function (err, tree) {
                                if (err) {
                                    console.log("ERR: " + err)
                                    res.json({})
                                } else {
                                    res.json(tree)
                                }
                            })
                        } else {
                            scoreFiles(repo, snapshots, function (err, repo) {
                                if (err) {
                                    console.log("ERR: " + err)
                                    res.json({})
                                } else {
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
            if (repo.Status.scan == 0) {
                console.log("Scan in progress...")
                res.json({})
            } else {
                scanFiles(repo, repoPath, function (err, repo) {
                    if (err) console.log("ERR: " + err)
                })
                res.json(repo)
            }
            
        }
    })

}

var scanFiles = function (repo, repoPath, callback) {
    repo.Status = {
        clone: 1,
        scan:  0, // scan inprogress
        score: -1
    }
    repoService.updateStatus(repo, repo.Status, function (err) {
        if (err) callback(err)
        else {
            fileService.scanFiles(repoPath, repo, function (err, repo) {
                if (err) {
                    var scan_err = err
                    repo.Status = {
                        clone: 1,
                        scan:  -1, // scan fail
                        score: -1
                    }
                    
                    repoService.updateStatus(repo, repo.Status, function (err) {
                        if (err) callback(err)
                        else {
                            console.log("Scan Failed...")
                            callback(scan_err)
                        }
                    })

                } else {
                    repoService.updateRepo(repo, function (err) {
                        if (err) callback(err)
                        else {
                            console.log("Files stored...")
                            callback(null, repo)
                        }
                    })
                }
            })
        }
    }) 
}

module.exports.update = function (req, res) {
    var repoURL     = req.params.repoUrl
    var repoURLHash = sha1(repoURL)
    var repoPath    = "tempProjects/" + repoURLHash

    repoService.retrieveRepo(repoURL, function (err, repo) {
        if (err) {
            console.log("ERR: " + err)
            res.json({})
        } else {
            if (repo.Status.clone == 0) {
                console.log("Pull in progress")
                res.json({})
            } else {
                updateFiles(repo, repoPath, function (err, repo) {
                    if (err) console.log("ERR: " + err) 
                })
                res.json(repo)
            }
        }
    })
}

var updateFiles = function(repo, repoPath, callback) {
    repo.Status = {
        clone: 0,
        scan: -1,
        score: -1
    }
    repoService.updateStatus(repo, repo.Status, function (err) {
        if (err) callback(err)
        else {
            gitService.gitPull(repo.URL, function (err, update) {
                if (err) {
                    repo.Status = {
                        clone: -1,
                        scan: -1,
                        score: -1
                    }
                    repoService.updateStatus(repo, repo.Status, function (err) {
                        if (err) callback(err)
                        else {
                            console.log("Pull Fail...")
                        }
                    })
                    callback(err)
                } else {
                    console.log("Pull successful...")
                    if (update && update.summary.changes > 0) {
                        scanFiles(repo, repoPath, function (err, repo) {
                            if (err) callback(err)
                            else callback(null, repo)
                        })   
                    } else {
                        repo.Status = {
                            clone: 1,
                            scan: 1,
                            score: -1
                        }
                        repoService.updateStatus(repo, repo.Status, function (err) {
                            if (err) callback(err)
                        })
                        callback(null, repo)
                    }
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
            if (repo.Status.score == 0) {
                console.log("Scoring in progress...")
                res.json({})
            } else {
                scoreFiles(repo, snapshots, function (err, repo) {
                    if (err) {
                        console.log("ERR: " + err)
                        res.json({})
                    } else {
                        res.json(repo)
                    }
                })
            }
        }
    })
}

var scoreFiles = function(repo, snapshots, callback) {

    repo.Status = {
        clone: 1,
        scan: 1,
        score: 0
    }
    repoService.updateStatus(repo, repo.Status, function (err) {
        if (err) callback(err) 
        else {
            scoringService.scoreSections(repo, snapshots, function (err, repo) {
                if (err) callback(err) 
                else {
                    scoringService.normalizeSection(repo, function (err, repo) {
                        if (err) callback(err) 
                        else {
                            repoService.updateRepo(repo, function (err, results) {
                                if (err) callback(err) 
                                else {
                                    console.log("Scores stored...")
                                }
                            })
                            callback(null, repo)
                        }
                    })
                }
            })
        }
    })
}