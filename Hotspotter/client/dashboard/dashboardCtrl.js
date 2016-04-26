(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.dashboardCtrl', []);
    ngModule.controller('dashboardCtrl', function ($http) {

        //"Global Variables"
        var vm = this;
        vm.success = false;
        vm.loading = false;
        vm.repos = [];

        vm.StatusEnum = {
           '-1': 'False',
            '0': 'In progress',
            '1': 'True'
        };      

        //"Global Functions"
        vm.addRepository = addRepository;
        vm.listRepos = listRepos;
        vm.init = init;

        //Anything that needs to be instantiated on page load goes in the init
        function init() {
            vm.listRepos();
        }
        init();

        // Add a repository
        function addRepository(repoUrl) {
            vm.loading = true;
            return $http.post("/api/repo/" + encodeURIComponent(repoUrl)).then(function (){
                vm.success = true;
                vm.addedRepo = vm.repoUrl;
                vm.repoUrl = '';
                vm.loading = false;
                listRepos();
            });
        }
        //Lists all repos that have been checked out
        function listRepos() {
            return $http.get('/api/repo').then( function (response){
                vm.repos = response.data;

            });
        }
    });
}(window.angular));
