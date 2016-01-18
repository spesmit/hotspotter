(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.adminCtrl', []);
    ngModule.controller('adminCtrl', function ($scope, $resource) {

        //"Global Variables"
        var File_repo = $resource("/api/file/:repoUrl");
        var File_list = $resource("/api/file/:listUrl");
        var Repo = $resource("/api/repo");

        var vm = this;
        vm.success = false;
        vm.files = [];

        vm.clearFiles = clearFiles;
        vm.listFiles = listFiles;
        vm.clearRepo = clearRepo;

        init();

        //Anything that needs to be instantiated on page load goes in the init
        function init() {
            
        }

        //Lists all files 
        function listFiles() {
            vm.files = File_list.query({listUrl: vm.listUrl});
        }

        function clearRepo() {
            Repo.remove();
        }

        function clearFiles() {
            File_repo.remove({repoUrl: vm.repoUrl});
        }

    });
}(window.angular));