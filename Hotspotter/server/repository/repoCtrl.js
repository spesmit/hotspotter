var Repo = require('./repoModel');
var gitService = require('../git/gitService');
var fileService = require('../file/fileService');
var repoService = require('./repoService');
var Glob = require('glob').Glob;
var File = require('../file/fileModel');
var async = require("async");
var crypto    = require("crypto");

var sha1      = function(input) {
  return crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex');
};

module.exports.create = function (req, res) {
    var repoUrl = req.params.repoUrl;
    var repo = new Repo();
    repo.URL = repoUrl;
    gitService.gitCheckout(repoUrl);
    repo.save(function (err, result) {
        res.json(result);
    });
};

module.exports.list = function (req, res) {
    Repo.find({}, function (err, results) {
        res.json(results);
    });
};

module.exports.view = function (req, res) {
    // build file structure json object from request and return
    var repoURL     = req.params.repo;
    var repoURLHash = sha1(repoURL);
    var repoPath    = "tempProjects/" + repoURLHash;

    Repo.findOne({ URL : repoURL }, 'Files', function(err, results) {
        // check if file metadata is in database
        if (err) {
            console.log("ERR: " + err);
            res.json([]);
        } else {
            if (results.Files.length == 0) {
                // walk files in local repo
                Glob(repoPath + "/**/*",{nodir:true},function (err, filePaths) {
                    if(err) {
                        console.log("ERR: " + err);
                        res.json([]);
                    } else {
                        // get file commits
                        gitService.gitLogCommits(repoPath, filePaths, function (files) {
                            // store file metadata in database
                            fileService.storeFiles(files, repoURL, function (files) {
                                // create fileView tree for GUI 
                                repoService.createTree(files, function (tree) {
                                    res.json(tree);
                                }); 
                            });               
                        });
                    }
                });
            } else {
                // fetch file metadata from database
                fileService.fetchFiles(repoURL, function (files) {
                    // create fileView tree GUI
                    repoService.createTree(files, function (tree) {
                        res.json(tree);
                    }); 
                });
            }
        }
    });
};

module.exports.clear = function (req, res) {
    var repoURL = req.params.repoUrl;
    //console.log(repoURL);
    Repo.remove({URL: repoURL}, function(err, results) {
        if (err) {
            console.log("ERR: " + err);
        } else {
            console.log('\n' + repoURL + ' repo deleted... \n');
            res.write(JSON.stringify({ status: 'DELETED' }));
            res.end();
        }
    });

};
