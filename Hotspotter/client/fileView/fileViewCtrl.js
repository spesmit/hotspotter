(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.fileViewCtrl', []);
    ngModule.controller('fileViewCtrl', function ($scope, $resource, ParsingService) {
        // Do stuff
        //$scope.tree = [{name: "Node", nodes: []}];  });
	    $scope.treeData = {
	      name: "/",
	      children: [{
	        name: "dir1/",
	        children: [{
	          name: "file1"
	        },{
	          name: "file2"
	        },{
	          name: "dir2/",
	          children: [{
	        	name: "file4"
	        	}]
	        }]
	      },{
	        name: "file3"
	      }]
	    };
	   var list = ["/dir1/file1", "/file2", "/dir2/dir3/file3", "/dir4/dir1/file4"];
	   $scope.treeData = ParsingService.ParsingAPI(list);
	  });
   
}(window.angular));