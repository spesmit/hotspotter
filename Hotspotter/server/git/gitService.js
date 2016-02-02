/**
 * Created by natem on 10/25/2015.
 */
var localPath = ('./tempProjects')
var File      = require('../file/fileModel')
var Commit    = require('../commit/commitModel')
var async     = require("async")
var crypto    = require("crypto")

var sha1      = function(input) {
  return crypto.createHash('sha1')
            .update(JSON.stringify(input))
            .digest('hex')
}


exports.gitCheckout = function (repoURL, callback) {
    var simpleGitClone = require('simple-git')()
    var repoURLHash = sha1(repoURL)
    var repoPath = localPath + "/" + repoURLHash
    console.log("REPO URL: " + repoURL)
    console.log("REPO HASH: " + repoURLHash)
    simpleGitClone
        .outputHandler(function (command, stdout, stderr) {
            stdout.pipe(process.stdout)
            stderr.pipe(process.stderr)
        })
        .clone(repoURL, repoPath)
}

exports.gitLogCommits = function (repoPath, filePaths, repo, callback) {
    var simpleGit = require('simple-git')("./" + repoPath)
    var files = []
    var FirstModified = new Date()
    var LastModified = new Date()

    async.each(filePaths, function (filePath, callback) {
        simpleGit.log({'file': filePath.replace(repoPath + "/", '')}, function (err, log) {
            console.log(log.all)

            // Loop through commits in log and add to Commits array
            commits = []
            commitsLog = log.all
            async.each(commitsLog, function (commit, callback) {
                commits.push(new Commit({
                    Time: commit.date,
                    Hash: commit.hash,
                    Author: commit.author_name
                }))
            })

            files.push(new File({
                FullPath: filePath,
                Commits: commits
            }))
            callback()
        })
    },
    function (err) {
        repo.Files = files
        if (err) return callback(err)
        else return callback(null, repo)
    })

}
