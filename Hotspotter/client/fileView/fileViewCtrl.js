(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.fileViewCtrl', []);
    ngModule.controller('fileViewCtrl', function ($scope, $resource) {
        // Do stuff
         $scope.files = ["file1", "file2", "file3"];
    });
}(window.angular));