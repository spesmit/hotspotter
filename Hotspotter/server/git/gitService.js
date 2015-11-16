/**
 * Created by natem on 10/25/2015.
 */
var localPath = ('./tempProjects');
var File = require('../file/fileModel');
var simpleGit = require('simple-git')(localPath);
var async = require("async");


exports.gitCheckout = function (repoURL){
    console.log("REPO URL: " + repoURL);
    simpleGit
        .outputHandler(function (command, stdout, stderr) {
            stdout.pipe(process.stdout);
            stderr.pipe(process.stderr);
        })
        .clone(repoURL,localPath);
};

exports.gitLogCommits = function (filePaths, res) {
    async.each(filePaths, function (file, callback) {
        simpleGit.log({'file': file.replace('tempProjects/', '')}, function (err, log) {
            res = new File({
                Name: file,
                Commits: log.total
            });
            console.log("File " + res.Name + " has " + res.Commits + " commits");
            callback()
        });
    });

};


