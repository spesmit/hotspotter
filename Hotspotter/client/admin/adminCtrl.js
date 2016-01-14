(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.adminCtrl', []);
    ngModule.controller('adminCtrl', function ($scope, $resource) {

        //"Global Variables"
        var File = $resource("/api/file");

        var vm = this;
        vm.success = false;
        vm.files = [];

        vm.clearFiles = clearFiles;

        init();

        //Anything that needs to be instantiated on page load goes in the init
        function init() {
            listFiles();
        }

        //Lists all files 
        function listFiles() {
            vm.files = File.query();
        }

        function clearFiles() {
            vm.files = File.remove();
        }

    });
}(window.angular));