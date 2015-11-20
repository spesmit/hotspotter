(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.dashboardCtrl', []);
    ngModule.controller('dashboardCtrl', function ($scope, $resource) {
    	var Repo = $resource("/api/repo");

    	$scope.success 		= false;
        $scope.repos = [];
    	$scope.addRepository = function() {
    		// Create new repository object and save URL
    		var repo = new Repo();
    		repo.URL = $scope.repoUrl;
                repo.$save(function (result){
                    $scope.repos.push(result);
                });
    		// Update frontend display
    		$scope.success = true;
    		$scope.added_repo = $scope.repoUrl;
    		$scope.repoUrl = '';
    	};
        // Log debug
        Repo.query(function (results){
            $scope.repos = results;
        });

    });
}(window.angular));