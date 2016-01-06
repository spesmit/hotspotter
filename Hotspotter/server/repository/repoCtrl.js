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
    Glob("tempProjects/**/*",{nodir:true},function (err, filePaths) {
        if(err) {
            console.log("ERR: " + err);
            res.json([]);
        } else {
            gitService.gitLogCommits(filePaths, function (files) {
                //console.log(files);

                var Max = 0;
                var Min = Number.MAX_VALUE;

                async.each(files, function (file, callback) {
                    if (file.Commits > Max) {
                        Max=file.Commits;
                    }
                    if (file.Commits < Min) {
                        Min=file.Commits;
                    }
                    callback();
                },
                function (err) {
                    var treeData = {folders: [], files: []};
                    var tree = treeData;
                    async.each(files, function (filePaths, callback) {
                        var pathSplit = filePaths.Name.replace(/\//g,'/,').split(/,/);
                        async.each(pathSplit, function (path, callback) {
                             // ignore '/' root directory
                            //console.log(filePaths);
                            if (path != '/') {
                                // insert file name
                                if (path.indexOf('/') < 0) {
                                    tree.files.push({name: path, score: (1-((filePaths.Commits-Min)/(Max-Min)))});
                                // insert directory name
                                } else {
                                // find next directory in path
                                var found = 0;
                                //console.log(tree);
                                async.each(tree.folders, function (folder, callback) {
                                    if (folder.name == path) {
                                        tree = folder;
                                        found = 1;
                                        //break;
                                    } 
                                    callback();
                                },
                                function (err) {
                                    // directory doesn't exists so create folder object
                                    if (found === 0) {
                                        tree.folders.push({name: path, folders: [], files: []});
                                        tree = tree.folders[tree.folders.length-1];
                                    }  
                                });
                                }
                            }
                            callback();
                        },
                        function (err) {
                            tree = treeData;
                        });
                    callback();
                    },
                    function (err) {
                        res.json(treeData)
                    });
                
                });
            });
        }
    });
       
};
