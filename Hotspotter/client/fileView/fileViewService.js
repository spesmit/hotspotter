(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.fileViewService', []);
	ngModule.service('fileViewService', function () {
	this.ParsingAPI = function(list) {
        console.log(list);

        var Max = 0;
        var Min = Number.MAX_VALUE;
        for (var i = 0, len_i=list.length; i < len_i; i++) {
            if (list[i].Commits > Max) {
                Max=list[i].Commits;
            }
            if (list[i].Commits < Min) {
                Min=list[i].Commits;
            }

        }

		var treeData = {folders: [], files: []};
        var tree = treeData;
        // loop through file paths
		for (i = 0, len_i=list.length; i < len_i; i++) {
			// Split file paths into array and loop through 
			var pathSplit = list[i].Name.replace(/\//g,'/,').split(/,/);
			for (var j = 0, len_j=pathSplit.length; j < len_j; j++) {
                // ignore '/' root directory
                if (pathSplit[j] != '/') {
                    // insert file name
                    if (pathSplit[j].indexOf('/') < 0) {
                        tree.files.push({name: pathSplit[j], score: (1-((list[i].Commits-Min)/(Max-Min)))});
                    // insert directory name
                    } else {
                        // find next directory in path
                        var found = 0;
                        for(var index in tree.folders) {
                            if (tree.folders[index].name == pathSplit[j]) {
                                tree = tree.folders[index];
                                found = 1;
                                break;
                            } 
                        }
                        // directory doesn't exists so create folder object
                        if (found === 0) {
                            tree.folders.push({name: pathSplit[j], folders: [], files: []});
                            tree = tree.folders[tree.folders.length-1];
                        }  
                    }    
                }      
			}
        tree = treeData;
		}
	return treeData;
	};


});
}(window.angular));