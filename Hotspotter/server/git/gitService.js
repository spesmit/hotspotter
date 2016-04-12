/**
 * Created by natem on 10/25/2015.
 */
var localPath = ('./tempProjects')
var File      = require('../file/fileModel')
var Commit    = require('../commit/commitModel')
var fsService = require('../fs/fsService')
var fileService = require('../file/fileService')
var diffService = require('../diff/diffService')
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
            var fileHash = sha1(filePath)

            exec('git log -p --pretty=format:%H --follow ' + path + ' > ' + '.' + fileHash + '.txt',  { cwd: './'+repoPath }, function(err, std, stderr) {

                if (err) callback(err)

                var file = repoPath + '/' + '.' + fileHash + '.txt'
                fsService.extractDiff(file, function(err, diff_RAW) {
                    if (err) callback(err)
                    else {

                        async.each(commitsLog, function (commit, callback) {
                            // Determine if commit was a bug fixing commits
                            // Keywords taken from: https://stackoverflow.com/questions/1687262/link-to-github-issue-number-with-commit-
                            var bugfix = false
                            if(commit.message.indexOf('fix') != -1 ||
                                commit.message.indexOf('close') != -1 ||
                                commit.message.indexOf('resolve')!= -1) {
                                    bugfix = true
                            }

                            commit.hash = commit.hash.replace(/\W/g, '')

                            var hashIndex = diff_RAW.indexOf(commit.hash)
                            var newLineIndex = diff_RAW.indexOf('\n\n', hashIndex); 

                            if (newLineIndex == -1) newLineIndex = diff_RAW.length-1;

                            //console.log(hashIndex + " " + newLineIndex)

                            var diff_raw = diff_RAW.substring(hashIndex, newLineIndex)
                            
                            diffService.parseDiff(diff_raw, function (err, diff) {
                                if (err) callback(err)
                                else {
                                    commits.push(new Commit({
                                        Time: commit.date,
                                        Hash: commit.hash,
                                        Author: commit.author_name,
                                        BugFix: bugfix,
                                        Diff_RAW: diff_raw,
                                        Diff: diff
                                    })) 
                                    callback()
                                }          
                            })

                        },
                        function(err) {

                            if (err) callback(err)
                            else {
                                files.push(new File({
                                    FullPath: filePath,
                                    Commits: commits
                                }))

                                console.log("File", files[files.length-1].FullPath)
                                // fileService.storeFile(repo, files[files.length-1], function (err, result) {
                                //     if (err) callback(err)
                                //     else {
                                //        callback() 
                                //     }
                                // })         
                                callback()
                            }
                        })
                    }
                })
            })               
        })
    },
    function (err) {
        if(err) return callback(err)
        
        simpleGit.log(function (err, log) {
            repo.Files = files

            repo.FirstModified = log.all[log.all.length - 1].date
            repo.LastModified = log.all[0].date

            if (err) return callback(err)
            else return callback(null, repo)
        })
    })

}
