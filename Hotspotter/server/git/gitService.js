/**
 * Created by natem on 10/25/2015.
 */
var localPath = ('./tempProjects');
var simpleGit = require('simple-git')(localPath);

exports.gitCheckout = function (repoURL){
    console.log("REPO URL: " + repoURL);
    simpleGit
        .outputHandler(function (command, stdout, stderr) {
            stdout.pipe(process.stdout);
            stderr.pipe(process.stderr);
        })
        .clone(repoURL,localPath);
};

exports.gitLogCommits = function (filePath, res){
    console.log("File Path: " + filePath);
    simpleGit
    .log({'file' : filePath.replace('tempProjects/', '')}, function(err, log) {
        res(log.total, filePath);
    })
};

