/**
 * Created by natem on 10/25/2015.
 */
var localPath = ('./tempProjects');
var File      = require('../file/fileModel');
var async     = require("async");
var crypto    = require("crypto");
var sha1      = function(input) {
  return crypto.createHash('sha1')
            .update(JSON.stringify(input))
            .digest('hex');
}


exports.gitCheckout = function (repoURL){
    var simpleGitClone = require('simple-git')();
    var repoURLHash = sha1(repoURL);
    var repoPath = localPath + "/" + repoURLHash;
    console.log("REPO URL: " + repoURL);
    console.log("REPO HASH: " + repoURLHash);
    simpleGitClone
        .outputHandler(function (command, stdout, stderr) {
            stdout.pipe(process.stdout);
            stderr.pipe(process.stderr);
        })
        .clone(repoURL, repoPath);
};

exports.gitLogCommits = function (repoPath, filePaths, res) {
    console.log(repoPath);
    var simpleGit = require('simple-git')("./" + repoPath);
    var files = [];
    async.each(filePaths, function (filePath, callback) {
        simpleGit.log({'file': filePath.replace(repoPath + "/", '')}, function (err, log) {
            files.push(new File({
                Name: filePath,
                Commits: log.total
            }));
            callback();
        });
    },
    function (err) {
        //console.log(files);
        res(files);
    });

};
