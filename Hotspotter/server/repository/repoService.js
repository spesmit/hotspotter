/**
 * Created by SmithS on 01/12/2016.
 */

var File = require('../file/fileModel');
var async = require("async");

exports.createTree = function (files, res) {
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
        async.each(files, function (filePaths, callback1) {
            //console.log(files);
            var pathSplit = filePaths.FullPath.replace(/\//g,'/,').split(/,/);
            async.each(pathSplit, function (path, callback2) {
                 // ignore '/' root directory
                //console.log(filePaths);
                if (path != '/') {
                    // insert file name
                    if (path.indexOf('/') < 0) {
                        tree.files.push({name: path, score: (1-((filePaths.Commits-Min)/(Max-Min)))});
                    // insert directory name
                    } else {
                    // find next directory in path
                    //console.log(tree);
                    async.each(tree.folders, function (folder, callback3) {
                        if (folder.name == path) {
                            tree = folder;
                            var found = new Error();
                            found.break = true;
                            return callback3(found);
                        } 
                        callback3();
                    },
                    function (err) {
                        // directory doesn't exists so create folder object
                        if (err && err.break) {
                            // do nothing
                        } else {
                            tree.folders.push({name: path, folders: [], files: []});
                            tree = tree.folders[tree.folders.length-1];
                        }
                    });
                    }
                }
                callback2();
            },
            function (err) {
                tree = treeData;
            });
        callback1();

        },
        function (err) {
            res(treeData);
        });
    
    });
};