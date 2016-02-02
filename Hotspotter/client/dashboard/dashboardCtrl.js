(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.dashboardCtrl', []);
    ngModule.controller('dashboardCtrl', function ($scope, $http) {

        //"Global Variables"
        var vm = this;
        vm.success = false;
        vm.repos = [];

        //"Global Functions"
        vm.addRepository = addRepository;

        //Anything that needs to be instantiated on page load goes in the init
        function init() {
            listRepos();
        }
        init();

        // Add a repository
        function addRepository(repoUrl) {
            $http.post("/api/repo/" + encodeURIComponent(repoUrl)).then(function (){
                vm.success = true;
                vm.addedRepo = vm.repoUrl;
                vm.repoUrl = '';
                listRepos();
            });
        }
        //Lists all repos that have been checked out
        function listRepos() {
            $http.get('/api/repo').then( function (response){
                vm.repos = response.data;

            });
        }
    });
}(window.angular));
