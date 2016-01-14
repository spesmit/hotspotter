var Repo = require('./repoModel');
var gitService = require('../git/gitService');
var fileService = require('../file/fileService');
var repoService = require('./repoService');
var Glob = require('glob').Glob;
var File = require('../file/fileModel');
var async = async = require("async");

module.exports.create = function (gitUrl, res) {
    var repo = new Repo(gitUrl.body);
    gitService.gitCheckout(repo.URL);
    repo.save(function (err, result) {
        res.json(result);
    });
};

module.exports.list = function (req, res) {
    Repo.find({}, function (err, results) {
        res.json(results);
    });
};

module.exports.view = function (gitUrl, res) {
    // build file structure json object from request and return

    var url = gitUrl.params.repo;

    fileService.findRepoID(url, function (repoID) {
        File.findOne({ RepoID: repoID }, function(err, results) {
            //console.log(results)
            if (results == undefined) {
                Glob("tempProjects/**/*",{nodir:true},function (err, filePaths) {
                    if(err) {
                        console.log("ERR: " + err);
                        res.json([]);
                    } else {
                        gitService.gitLogCommits(filePaths, function (files) {
                            fileService.storeFiles(files, repoID, function (files) {
                                repoService.createTree(files, function (tree) {
                                    res.json(tree);
                                }); 
                            });               
                        });
                    }
                });
            } else {
                fileService.fetchFiles(repoID, function (files) {
                    repoService.createTree(files, function (tree) {
                        res.json(tree);
                    }); 
                });
            }
        });
    });
};
