(function (angular) {
    'use strict';
//===============================Frontend Dependencies================================================
    var app = angular.module('hotspotter', [
        'ngRoute',
        'ngResource',
        'AxelSoft',
        'ngLodash',
        'hotspotter.dashboardCtrl',
        'hotspotter.fileViewCtrl',
        'hotspotter.adminCtrl'
    ]);
//==================================Route Provider==============================================================
// Definitions of what happens when urls are hit. This defines the controller and the html page it needs to render
    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){
        $routeProvider.when(
            '/', {
                templateUrl: 'dashboard/dashboard.html',
                pageName: 'Dashboard',
                controller: 'dashboardCtrl'
            });

        $routeProvider.when(
            '/fileView', {
                templateUrl: 'fileView/fileView.html',
                pageName: 'FileView',
                controller: 'fileViewCtrl'
            });

         $routeProvider.when(
            '/admin', {
                templateUrl: 'admin/admin.html',
                pageName: 'admin',
                controller: 'adminCtrl'
            });

        $routeProvider.otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true);

    }]);
}(window.angular));