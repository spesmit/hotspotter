/**
 * Created by natem on 10/25/2015.
 */
var localPath = ('./tempProjects')
var File      = require('../file/fileModel')
var Commit    = require('../commit/commitModel')
var async     = require("async")
var crypto    = require("crypto")
var diffParse = require("parse-diff")


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
        .clone(repoURL, repoPath, function(err) {
            if (err) callback(err)
            else callback(null)
        })
}

exports.gitPull = function (repoURL, callback) {
   
    var repoURLHash = sha1(repoURL)
    var repoPath = localPath + "/" + repoURLHash
    var simpleGitPull = require('simple-git')(repoPath)
    console.log("REPO URL: " + repoURL)
    console.log("REPO HASH: " + repoURLHash)
    simpleGitPull
        .outputHandler(function (command, stdout, stderr) {
            stdout.pipe(process.stdout)
            stderr.pipe(process.stderr)
        })
        .pull(repoURL, function(err) {
            if (err) callback(err)
            else callback(null)
        })
}

exports.gitLogCommits = function (repoPath, filePaths, repo, callback) {
    var simpleGit = require('simple-git')("./" + repoPath)
    var exec = require('child_process').exec;
    var files = []
    var FirstModified = new Date()
    var LastModified = new Date()
    //var Hashes = new Set()

    async.each(filePaths, function (filePath, callback) {

        var path = filePath.replace(repoPath + "/", '')
        simpleGit.log({'file': path}, function (err, log) {

            // Loop through commits in log and add to Commits array
            commits = []
            var commitsLog = log.all
            count = 0

            exec('git log -p --pretty=format:%H --follow ' + path,  { cwd: './'+repoPath }, function(err, std, stderr) {

                async.each(commitsLog, function (commit, callback) {
                    // Determine if commit was a bug fixing commits
                    // Keywords taken from: https://stackoverflow.com/questions/1687262/link-to-github-issue-number-with-commit-
                    var bugfix = false
                    if(commit.message.indexOf('fix') != -1 ||
                        commit.message.indexOf('close') != -1 ||
                        commit.message.indexOf('resolve')!= -1) {
                            bugfix = true
                    }


                    var hashIndex = std.indexOf(commit.hash)
                    var newLineIndex = std.indexOf('\n\n', hashIndex)

                    if (newLineIndex == -1) newLineIndex = std.length-1;

                    //console.log(hashIndex + " " + newLineIndex)

                    var diffObject = null
                    var diff = std.substring(hashIndex, newLineIndex)

                    var content = [], additions, deletions, index = [], to, from, fileNew

                    if (diff.indexOf('similarity index 100%') == -1) {
                        diffObject = diffParse(diff)

                        //console.log(diffObject)

                        content = diffObject[0].chunks
                        additions = diffObject[0].additions
                        deletions = diffObject[0].deletions
                        index = diffObject[0].index
                        to = diffObject[0].to
                        from = diffObject[0].from
                        fileNew = false
                        if (diffObject[0].new) fileNew = true 

                    } else {
                        content = []
                        additions = 0
                        deletions = 0
                        index = []
                        var toIndex = diff.indexOf('rename to') + 10
                        var fromIndex = diff.indexOf('rename from') + 12
                        to = diff.substring(toIndex, diff.length)
                        from = diff.substring(fromIndex, diff.indexOf('\n', fromIndex))
                        fileNew = false
                    }

                    commits.push(new Commit({
                        Time: commit.date,
                        Hash: commit.hash,
                        Author: commit.author_name,
                        BugFix: bugfix,
                        Content: content,
                        Additions: additions,
                        Deletions: deletions,
                        Index: index,
                        To: to,
                        From: from,
                        New: fileNew
                    }))

                    //Hashes.add(commit.hash)

                    callback()
                },
                function(err) {
                    //console.log(path)
                    files.push(new File({
                        FullPath: filePath,
                        Commits: commits
                    }))
                })
            })

            callback()
        })
    },
    function (err) {
        if(err) return callback(err)
        
        simpleGit.log(function (err, log) {
            //console.log(log)
            repo.Files = files

            repo.FirstModified = log.all[log.all.length - 1].date
            repo.LastModified = log.all[0].date

            if (err) return callback(err)
            else return callback(null, repo)
        })
    })

}
