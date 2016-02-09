(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.adminCtrl', []);
    ngModule.controller('adminCtrl', function ($scope, $resource) {

        //"Global Variables"
        var File = $resource("/api/file/:repoUrl");
        var Repo_del = $resource("/api/repo/:repoUrl");
        var Repo = $resource("/api/repo");

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
            vm.repos = Repo.query();
        }

        //Lists all files
        function listFiles(url) {
            vm.files = File.query({repoUrl: url});
            console.log(vm.files);
        }

        function clearRepo(url) {
            Repo_del.remove({repoUrl: url});
        }

        function clearFiles(url) {
            File.remove({repoUrl: url});
        }

    });
}(window.angular));
