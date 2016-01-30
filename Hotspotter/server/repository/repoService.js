/**
 * Created by SmithS on 01/12/2016.
 */

var File = require('../file/fileModel');
var async = require("async");

exports.createTree = function (files, res) {

    var treeData = {folders: [], files: []};
    // tree pointer
    var tree = treeData;

    for (var i = 0; i < files.length;i++) {
        // remove tempProject and git hash directory
        var pathTrim = files[i].FullPath.replace(/tempProjects\/[^\/]*\//,'');
        // split full file path
        var path = pathTrim.replace(/\//g,'/,').split(/,/);

        for (var j = 0; j < path.length;j++) {
            // ignore '/' root directory
            if (path[j] != '/') {
                // insert file name
                if (path[j].indexOf('/') < 0) {
                    tree.files.push({name: path[j], score: files[i].Score});
                } else {
                // find next directory in path
                    var found = 0;
                    for (var k = 0; k < tree.folders.length;k++) {
                        if (tree.folders[k].name == path[j]) {
                            tree = tree.folders[k];
                            found = 1;
                            break;
                        } 
                    }
                
                    if (!found) {
                        // directory doesn't exists so create folder object
                        tree.folders.push({name: path[j], folders: [], files: []});
                        tree = tree.folders[tree.folders.length-1];
                    }
                }
            }
        }
        //reset pointer
        tree = treeData
    }
    res(treeData);
}

 


    

    

    