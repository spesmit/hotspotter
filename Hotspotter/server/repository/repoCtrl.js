var Repo = require('./repoModel');
var gitService = require('../git/gitService');
var repoService = require('./repoService');
var Glob = require('glob').Glob;
var File = require('../file/fileModel');
var async = async = require("async");
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
    var repoURL     = req.params.repo;
    var repoURLHash = sha1(repoURL);
    var repoPath    = "tempProjects/" + repoURLHash;
    // build file structure json object from request and return
    Glob(repoPath + "/**/*",{nodir:true},function (err, filePaths) {
        if(err) {
            console.log("ERR: " + err);
            res.json([]);
        } else {
            gitService.gitLogCommits(repoPath, filePaths, function (files) {
                repoService.createTree(files, function (tree) {
                    res.json(tree);
                });
            });
        }
    });

};
