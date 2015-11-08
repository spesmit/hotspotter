(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.fileViewCtrl', ['AxelSoft']);
    ngModule.controller('fileViewCtrl', function ($scope, $resource, ParsingService) {
        // Do stuff
        var Repo = $resource("/api/repo");

        $scope.files 		= false;
        $scope.database		= true;
        $scope.items = Repo.query({});

        // Example stucture
	    /*$scope.structure = { folders: [
    		{ name: 'Folder 1', files: [{ name: 'File 1.jpg' }, { name: 'File 2.png' }], 
    		folders: [{ name: 'Subfolder 1', files: [{ name: 'Subfile 1' }] },
        	{ name: 'Subfolder 2' },{ name: 'Subfolder 3' }
    		]},{ name: 'Folder 2', files: [], folders: [] }
		]};*/

		$scope.viewRepository = function(url) {
    		// list of file paths
	    	$scope.files = true;
	    	$scope.database = false;

	    	// Debugging
	    	console.log(url);

	    	var list = ["/dir1/file1", "/dir1/file2", "/dir1/dir3/file3", "/dir4/dir1/file4"];

	    	// create json object in tree format fome path array
	    	$scope.structure = ParsingService.ParsingAPI(list);

	    	$scope.options = {
	    	onNodeSelect: function (node, breadcrums) {
	        	$scope.breadcrums = breadcrums;
	    		}
			};

    	};

	  });
   
}(window.angular));