(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.scoringCtrl', []);
    ngModule.controller('scoringCtrl', function ($scope, $resource) {

        //"Global Variables"
        var vm = this;
        var Repo = $resource("/api/repo");
        
        vm.list = true;
        vm.results = false;
        vm.div = false;

        vm.repo = {};
        vm.repos = [];

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

            vm.list = false;
            vm.div = true;
           
            vm.repo = Score.query({repoUrl : repoURL, sections : 25}, function () {
                console.log(vm.repo);
            });
        }

        function scoreRepo(repoURL) {
            var Score = $resource("/api/scoring/:repoUrl", {}, {'query': {method: 'GET', isArray: false}});

            vm.list = false;
            vm.results = true;
            
            vm.repo = Score.query({repoUrl : repoURL}, function () {
                console.log(vm.repo);
            });
        }

    });
}(window.angular));
