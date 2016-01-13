(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.dashboardCtrl', []);
    ngModule.controller('dashboardCtrl', function ($scope, $resource) {

        //"Global Variables"
        var Repo = $resource("/api/repo");


        var vm = this;
        vm.success = false;
        vm.repos = [];

        //"Global Functions"
        vm.addRepository = addRepository;


        init();

        //Anything that needs to be instantiated on page load goes in the init
        function init() {
            listRepos();
        }

        //Adds checkouts a repository
        function addRepository() {

            var repo = new Repo();

            repo.URL = vm.repoUrl;

            //Save Repo to Database
            repo.$save(function (result) {
                vm.repos.push(result);
            });

            // Update frontend display
            vm.success = true;
            vm.addedRepo = vm.repoUrl;
            vm.repoUrl = '';
        }

        //Lists all repos that have been checked out
        function listRepos() {
            vm.repos = Repo.query();
        }

    });
}(window.angular));