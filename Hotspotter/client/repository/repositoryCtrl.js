(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.repositoryCtrl', []);
    ngModule.controller('repositoryCtrl', function ($scope, $http, lodash) {

        //"Global Variables"
        var vm = this;
        vm.repos = [];
        vm.database = true;
        vm.reposelected = false;
        vm.selected = {};
        vm.loading = false;

        //"Global Functions"
        vm.init =  init;
        vm.selectRepo = selectRepo;
        vm.clearRepo = clearRepo;
        vm.scanRepo = scanRepo;
        vm.updateRepo = updateRepo;
        vm.scoreRepo = scoreRepo;
        vm.removeRepo = removeRepo;

        //Initialisation;
        init();

        //Anything that needs to be instantiated on page load goes in the init
        function init() {
            listRepos();
        }

        function listRepos() {
            $http.get('/api/repo').then( function (response){
                vm.repos = response.data;
                console.log(vm.repos);
            });
        }

        function selectRepo(url, status) {
            vm.database = false;
            vm.reposelected = true;
            
            var score = "Score"; 
            var scan = "Scan";

            if (status.score > 0) score = "Rescore";

            if (status.scan > 0) scan = "Rescan";

            vm.selected = {
                URL: url,
                Status: status,
                Options : {
                    Score : score,
                    Scan : scan
                }
            };
    

        }

        function clearRepo() {
            vm.database = true;
            vm.reposelected = false;
            vm.selected = {};
        }

        function scanRepo(repoUrl) {
           vm.loading = true;
            $http.get('/api/repo/scan/' + encodeURIComponent(repoUrl)).then( function (response){
                console.log(response.data);
                vm.loading = false;
                vm.selected.Status.scan = true;
                vm.selected.Options.Scan = "Rescan";
            });
        }

        function updateRepo(repoUrl) {
            vm.loading = true;
            $http.get('/api/repo/update/'+ encodeURIComponent(repoUrl)).then( function (response){
                console.log(response.data);
                vm.loading = false;
            });
        }

        function scoreRepo(repoUrl, snapshots) {
            vm.loading = true;
            $http.get('/api/repo/score/'+ encodeURIComponent(repoUrl) + '/' +  encodeURIComponent(snapshots)).then( function (response){
                console.log(response.data);
                vm.loading = false;
                vm.selected.Status.score = true;
                vm.selected.Options.Score = "Rescore";
            });
        }

        function removeRepo(repoUrl) {
            vm.loading = true;
            $http.delete('/api/repo/'+ encodeURIComponent(repoUrl)).then( function (response){
                var index = lodash.findIndex(vm.repos, {'URL': repoUrl});
                vm.repos.splice(index, 1);
                clearRepo();
                vm.loading = false;
            });
        }

    });
}(window.angular));