var Repo = require('./repoModel');
var gitService = require('../git/gitService');
var Glob = require('glob').Glob;
var File = require('../file/fileModel');
var async = async = require("async");

module.exports.create = function (gitUrl, res) {
    var repo = new Repo(gitUrl.body);
    Git.gitCheckout(repo.URL);
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
    var repoUrl = req.params.repo;

    var files = [];
    //Glob("tempProjects/" + repoUrl + "/**/*.*", function (err, files) {
    Glob("tempProjects/**/*.*", function (err, filePaths) {

        if(err) {
            console.log("ERR: " + err);
            res.json([]);
        } else {
            async.each(filePaths, function(file, callback){
                newFile = gitService.gitLogCommits(file);
                //console.log(newFile.Name);
                //files.push(new File({
                //    Name: res.filePath,
                //    Commits: res.total
                //}));
                callback()
            });
            }

        });
    console.log(files);
    res.json(files);
};
