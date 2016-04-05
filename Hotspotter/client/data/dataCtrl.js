(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.dataCtrl', []);
    ngModule.controller('dataCtrl', function ($scope, $resource) {

        //"Global Variables"
        var vm = this;
        var Repo = $resource("/api/repo");
        
        vm.results = false;
        vm.div = false;
        vm.loading = false;

        vm.repo = {};
        vm.repos = [];
        vm.data = [];

        //"Global Functions"
       vm.scoreRepo = scoreRepo;
       vm.scoreDiv = scoreDiv;

        //Anything that needs to be instantiated on page load goes in the init
        function init() {
            listRepos();
        }
        init();

        function listRepos() {
            vm.repos = Repo.query();
        }

        function scoreDiv(repoURL) {
            var Score = $resource("/api/scoring/:repoUrl/:sections", {}, {'query': {method: 'GET', isArray: false}});

            vm.div = true;
            vm.loading = true;
            vm.repo = Score.query({repoUrl : repoURL, sections : 100}, function () {
                console.log(vm.repo);
                vm.loading = false;
            });
        }

        function scoreRepo(repoURL) {
            var Score = $resource("/api/scoring/:repoUrl", {}, {'query': {method: 'GET', isArray: false}});

            vm.results = true;
            vm.loading = true;
            vm.repo = Score.query({repoUrl : repoURL}, function () {
                console.log(vm.repo);
                vm.loading = false;
            });
        }

        
    });
}(window.angular));
