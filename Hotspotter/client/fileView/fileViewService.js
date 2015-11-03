(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.fileViewService', []);
	ngModule.service('ParsingService', function () {
	this.ParsingAPI = function(list) {
		var treeData = {folders: [], files: []};
        var tree = treeData;
		angular.forEach(list, function(value) {
			// Split file paths into array and loop through 
			var pathSplit = value.replace(/\//g,'/,').split(/,/);
			angular.forEach(pathSplit, function(value) {
                
                // ignore '/' root directory
                if (value != '/') {
                    
                    // insert file name
                    if (value.indexOf('/') < 0) {
                        tree.files.push({name: value});
                    // insert directory name
                    } else {

                        // directory doesn't exists so create folder object
                        if (tree.folders.indexOf(value) < 0) {
                            tree.folders.push({name: value, folders: [], files: []});
                        } 

                        // find next directory in path
                        for(var key in tree.folders) {
                            if (tree.folders[key].name == value) {
                                tree = tree.folders[key];
                                break;
                            } 
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