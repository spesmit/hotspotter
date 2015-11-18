var Repo = require('./repoModel');
var gitService = require('../git/gitService');
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

module.exports.view = function (req, res) {
    // build file structure json object from request and return
    Glob("tempProjects/**/*.*", function (err, filePaths) {
        if(err) {
            console.log("ERR: " + err);
            res.json([]);
        } else {
            gitService.gitLogCommits(filePaths, function (files) {
                res.json(files);
            });
        }
    });
   
};
