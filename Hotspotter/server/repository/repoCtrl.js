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
        //console.log(results);
        res.json(results);
    });
};

module.exports.view = function (gitUrl, res) {
    // build file structure json object from request and return

    var url = gitUrl.params.repo;

    Repo.findOne({ URL : url }, 'Files', function(err, results) {
        //console.log(results.Files.length);
        if (results.Files.length == 0) {
            Glob("tempProjects/**/*",{nodir:true},function (err, filePaths) {
                if(err) {
                    console.log("ERR: " + err);
                    res.json([]);
                } else {
                    gitService.gitLogCommits(filePaths, function (files) {
                        fileService.storeFiles(files, url, function (files) {
                            repoService.createTree(files, function (tree) {
                                res.json(tree);
                            }); 
                        });               
                    });
                }
            });
        } else {
            fileService.fetchFiles(url, function (files) {
                repoService.createTree(files, function (tree) {
                    res.json(tree);
                }); 
            });
        }
    });

};

module.exports.clear = function (req, res) {
    Repo.remove({}, function(err) {
        console.log('\nCleared database... \n');
    });
};
