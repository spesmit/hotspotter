(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.adminCtrl', []);
    ngModule.controller('adminCtrl', function ($scope, $http, lodash) {

        //"Global Variables"
        var vm = this;
        vm.files = [];
        vm.repos = [];

        vm.clearFiles = clearFiles;
        vm.listFiles = listFiles;
        vm.clearRepo = clearRepo;

        init();

        //Anything that needs to be instantiated on page load goes in the init
        function init() {
            listRepos();
        }

        function listRepos() {
            $http.get("/api/repo").then(function (response) {
                vm.repos = response.data;
            });
        }
        //Lists all files
        function listFiles(url) {
            $http.get("/api/file/" + encodeURIComponent(url)).then(function (response){
                vm.files = response.data;
            });
        }

        function clearRepo(url) {
            $http.delete('/api/repo/' + encodeURIComponent(url)).then(function (){
                var index = lodash.findIndex(vm.repos, {'URL': url});
                vm.repos.splice(index);
            });

        }

        function clearFiles(url) {
            $http.delete("/api/file/" + encodeURIComponent(url)).then(function (){
                vm.files = [];
            });
        }
    });
}(window.angular));