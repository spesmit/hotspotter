(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.fileViewCtrl', ['AxelSoft']);
    ngModule.controller('fileViewCtrl', function ($scope, $resource, ParsingService) {
        // Do stuff
        
        // Example stucture
	    $scope.structure = { folders: [
    		{ name: 'Folder 1', files: [{ name: 'File 1.jpg' }, { name: 'File 2.png' }], 
    		folders: [{ name: 'Subfolder 1', files: [{ name: 'Subfile 1' }] },
        	{ name: 'Subfolder 2' },{ name: 'Subfolder 3' }
    		]},{ name: 'Folder 2', files: [], folders: [] }
		]};

		// list of file paths
	    var list = ["/dir1/file1", "/dir1/file2", "/dir1/dir3/file3", "/dir4/dir1/file4"];
	    
	    // create json object in tree format
	    $scope.structure = ParsingService.ParsingAPI(list);

	  
		$scope.options = {
	    	onNodeSelect: function (node, breadcrums) {
	        	$scope.breadcrums = breadcrums;
	    	}
		};

	  });
   
}(window.angular));