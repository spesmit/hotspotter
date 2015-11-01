(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.fileViewService', []);
	ngModule.service('ParsingService', function () {
	this.ParsingAPI = function(list) {
		var treeData = [];
		angular.forEach(list, function(value) {
			// Split file paths into tree structure
			var pathSplit = value.replace(/\//g,'/,').split(/,/);
			
			this.push(pathSplit);

		}, treeData);
	return treeData;
	};
});
}(window.angular));