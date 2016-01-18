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
}

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

module.exports.view = function (req, res) {
    // build file structure json object from request and return
    var repoURL     = req.params.repo;
    var repoURLHash = sha1(repoURL);
    var repoPath    = "tempProjects/" + repoURLHash;

    Repo.findOne({ URL : repoURL }, 'Files', function(err, results) {
        if (results.Files.length == 0) {
            Glob(repoPath + "/**/*",{nodir:true},function (err, filePaths) {
                if(err) {
                    console.log("ERR: " + err);
                    res.json([]);
                } else {
                    gitService.gitLogCommits(repoPath, filePaths, function (files) {
                        fileService.storeFiles(files, repoURL, function (files) {
                            repoService.createTree(files, function (tree) {
                                res.json(tree);
                            }); 
                        });               
                    });
                }
            });
        } else {
            fileService.fetchFiles(repoURL, function (files) {
                repoService.createTree(files, function (tree) {
                    res.json(tree);
                }); 
            });
        }
    });
}

module.exports.clear = function (req, res) {
    Repo.remove({}, function(err) {
        console.log('\nCleared database... \n');
    });
};
