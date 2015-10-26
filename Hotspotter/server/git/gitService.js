/**
 * Created by natem on 10/25/2015.
 */
var localPath = ('./tempProjects');
var simpleGit = require('simple-git')();

exports.gitCheckout = function (repoURL){
    console.log("REPO URL: " + repoURL);
    simpleGit
        .outputHandler(function (command, stdout, stderr) {
            stdout.pipe(process.stdout);
            stderr.pipe(process.stderr);
        })
        .clone(repoURL,localPath);
};


