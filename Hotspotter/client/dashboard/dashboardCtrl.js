(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.dashboardCtrl', []);

    ngModule.controller('dashboardCtrl', function ($scope) {
        $scope.welcome = 'Hotspotter is up and running hot!';
    });
}(window.angular));