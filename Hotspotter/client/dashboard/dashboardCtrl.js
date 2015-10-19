(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.dashboardCtrl', []);
    ngModule.controller('dashboardCtrl', function ($scope, $resource) {
    	var Repository = $resource('/api/repository');

    	$scope.success 		= false;

    	$scope.addRepository = function() {
    		// Create new repository object and save URL
    		var repository = new Repository();
    		repository.URL = $scope.repoUrl;
    		repository.$save();

    		// Update frontend display
    		$scope.success = true;
    		$scope.added_repo = $scope.repoUrl;
    		$scope.repoUrl = '';
    	};

    });
}(window.angular));