(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.fileViewService', []);
	ngModule.service('fileViewService', function () {
	this.ParsingAPI = function(list) {
        console.log(list);
		var treeData = {folders: [], files: []};
        var tree = treeData;
        // loop through file paths
		angular.forEach(list, function(value) {
			// Split file paths into array and loop through 
			var pathSplit = value.Name.replace(/\//g,'/,').split(/,/);
			angular.forEach(pathSplit, function(value) {
                // ignore '/' root directory
                if (value != '/') {
                    // insert file name
                    if (value.indexOf('/') < 0) {
                        tree.files.push({name: value});
                    // insert directory name
                    } else {
                        // find next directory in path
                        var found = 0;
                        for(var index in tree.folders) {
                            if (tree.folders[index].name == value) {
                                tree = tree.folders[index];
                                found = 1;
                                break;
                            } 
                        }
                        // directory doesn't exists so create folder object
                        if (found === 0) {
                            tree.folders.push({name: value, folders: [], files: []});
                            tree = tree.folders[tree.folders.length-1];
                        }  
                    }    
                }      
			}, treeData);
        tree = treeData;
		}, treeData);
	return treeData;
	};


});
}(window.angular));