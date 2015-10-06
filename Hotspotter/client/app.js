(function (angular) {
    'use strict';
    var app = angular.module('hotspotter', [
        'ngRoute',
        'ngResource',
        'hotspotter.dashboardCtrl'
    ]);

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){
        $routeProvider.when(
            '/', {
                templateUrl: 'dashboard/dashboard.html',
                pageName: 'Dashboard',
                controller: 'dashboardCtrl'
            });
        $routeProvider.otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true);

    }]);
}(window.angular));