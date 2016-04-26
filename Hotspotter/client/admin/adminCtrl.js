(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.adminCtrl', []);
    ngModule.controller('adminCtrl', function ($scope, $http, lodash) {

        //"Global Variables"
        var vm = this;
        vm.files = [];
        vm.repos = [];
        vm.loading = false;

        vm.clearFiles = clearFiles;
        vm.listFiles = listFiles;
        vm.clearRepo = clearRepo;
        vm.listRepos = listRepos;
        vm.init = init;

      //  init();

        //Anything that needs to be instantiated on page load goes in the init
        function init() {
            listRepos();
        }
        //Hits api endpoint to list all repos stored
        function listRepos() {
            return $http.get("/api/repo").then(function (response) {
                vm.repos = response.data;
            });
        }

        //Hits api endpoint to list all saved files for a given repo
        function listFiles(url) {
            vm.loading = true;
           return $http.get("/api/file/" + encodeURIComponent(url)).then(function (response){
                vm.files = response.data;
               vm.loading = false;
            });

        }
        //Hits api endpoint to delete a repo
        function clearRepo(url) {
            vm.loading = true;
            return $http.delete('/api/repo/' + encodeURIComponent(url)).then(function (){
                var index = lodash.findIndex(vm.repos, {'URL': url});
                vm.repos.splice(index, 1);
                vm.loading = false;
            });

        }
        //Hits api endpoint to delete saved metadata for a given repo
        function clearFiles(url) {
            vm.loading = true;
            return $http.delete("/api/file/" + encodeURIComponent(url)).then(function (){
                vm.files = [];
                vm.loading = false;
            });
        }
    });
}(window.angular));
