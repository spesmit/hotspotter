/**
 * Created by SmithS on 01/12/2016.
 */

var Repo = require('../repository/repoModel')
var File = require('../file/fileModel')
var async = require("async")

exports.createTree = function (files, callback) {

    var err = null
    var treeData = {folders: [], files: []}
    // tree pointer
    var tree = treeData

    for (var i = 0; i < files.length; i++) {
        // remove tempProject and git hash directory
        var pathTrim = files[i].FullPath.replace(/tempProjects\/[^\/]*\//,'')
        // split full file path
        var path = pathTrim.replace(/\//g,'/,').split(/,/)

        for (var j = 0; j < path.length; j++) {
            // ignore '/' root directory
            if (path[j] != '/') {
                // insert file name
                if (path[j].indexOf('/') < 0) {
                    tree.files.push({
                        name: path[j],
                        score: files[i].Score,
                        last_touched_by: files[i].Commits[0].Author,
                        last_updated: files[i].LastUpdated
                    })
                } else {
                // find next directory in path
                    var found = 0
                    for (var k = 0; k < tree.folders.length; k++) {
                        if (tree.folders[k].name == path[j]) {
                            tree = tree.folders[k]
                            found = 1
                            break
                        }
                    }

                    if (!found) {
                        // directory doesn't exists so create folder object
                        tree.folders.push({name: path[j], folders: [], files: []})
                        tree = tree.folders[tree.folders.length-1]
                    }
                }
            }
        }
        //reset pointer
        tree = treeData
    }
    if (err) return callback(err)
    else return callback(null, treeData)
}

// work in progress
exports.updateRepo = function (repo, callback) {
    data = repo.toObject()
    delete data._id

    Repo.findOneAndUpdate({URL:repo.URL}, data, function (err, result) {
        if (err) return callback(err)
        else return callback(null, result)
    })
}

exports.listRepo = function (callback) {

    Repo.find({}, 'URL Status FirstModified LastModified', function (err, results) {
        if (err) return callback(err)
        else return callback(null, results)
    })

}

exports.retrieveRepo = function (repoURL, options, callback) {

    // check for options
    if (typeof callback === 'undefined') {
        callback = options
        options = {}
    }

    Repo.findOne({ URL : repoURL }, function(err, results) {
        if (err) return callback(err)
        else return callback(null, results)
    })
}
