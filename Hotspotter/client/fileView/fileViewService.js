(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.fileViewService', []);

    function recurseTree(tree, depth, path) {
    var child = null;
    //console.log(tree);
    //console.log(depth);
    //console.log(path);
  	//var tempObject = {};
  	
	if (tree.indexOf(path[depth]) < 0) {
    	tree.push({name: path[depth], children: []});
  	} 
    if (depth === path.length -1) {
        	return;
    }
    // find current tree's child
    tree.forEach(function(entry) {
    	if (entry.name == path[depth]) {
    	for(var key in entry) {
    		//console.log(key);
	        if (key == 'children') {
	            child = entry.children; // found a child
	            break;
	        } 
    	}
    }
    });

    //console.log(child);
    if (child) { // recursively process on child
        recurseTree(child, depth+1, path);
    }
}

	ngModule.service('ParsingService', function () {
	this.ParsingAPI = function(list) {
		var treeData = {name: "/", children: []};
		angular.forEach(list, function(value) {
			// Split file paths into tree structure
			var pathSplit = value.replace(/\//g,'/,').split(/,/);
			//angular.forEach(pathSplit, function(value) {
			recurseTree(treeData.children, 1, pathSplit);
			//}, treeData);
		}, treeData);
	return treeData;
	};


});
}(window.angular));