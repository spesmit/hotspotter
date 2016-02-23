(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.fileViewCtrl', ['AxelSoft']);
    ngModule.controller('fileViewCtrl', function ($scope, $http) {

        //"Global Variables"
        var vm = this;
        vm.files = false;
        vm.database = true;
        vm.repos = [];
        vm.loading = false;
        vm.index = 0;
        vm.last = 10;
        vm.inc_disable = true;
        vm.dec_disable = false;
        vm.file = {};

        //"Global Functions"
        vm.viewRepository = viewRepository;
        vm.listRepos = listRepos;
        vm.clearView = clearView;
        vm.increment = increment;
        vm.decrement = decrement;
        vm.init =  init;

        //Initialisation;
        init();

        //Anything that needs to be instantiated on page load goes in the init
        function init() {
            listRepos();
        }

        //This function takes care of finding the repository and bringing back its filetree and scores
        function viewRepository(repoURL) {
            // list of file paths
            vm.files = true;
            vm.database = false;
            vm.loading = true;

            $http.get('/api/repo/' + encodeURIComponent(repoURL)).then(function (response){

                // Example structure
                /*$scope.structure = { folders: [
                 { name: 'Folder 1', files: [{ name: 'File 1.jpg' }, { name: 'File 2.png' }],
                 folders: [{ name: 'Subfolder 1', files: [{ name: 'Subfile 1' }] },
                 { name: 'Subfolder 2' },{ name: 'Subfolder 3' }
                 ]},{ name: 'Folder 2', files: [], folders: [] }
                 ]};*/

                 vm.index = response.data.files[0].scores.length;
                 vm.file = response.data.files[0];
                $scope.structure = response.data;
                $scope.options = {
                    onNodeSelect: function (node, breadcrums) {
                        vm.breadcrums = breadcrums;
                    }
                };
                vm.loading = false;
            });

        }
        function listRepos() {
            $http.get('/api/repo').then( function (response){
                vm.repos = response.data;

            });
        }

        function clearView(){
            vm.database = true;
            $scope.structure = [];

        }

        function increment() {
            vm.index++;
            if (vm.index >= vm.last) {
                vm.inc_disable = true;
                vm.index = vm.last;
            } else {
                vm.inc_disable = false;
                vm.dec_disable = false;
            }
            console.log(vm.index);
        }

        function decrement() {
            vm.index--;
            if (vm.index <= 1) {
                vm.index = 1;
                vm.dec_disable = true;
            } else {
                vm.inc_disable = false;
                vm.dec_disable = false;
            }
            console.log(vm.index);
        }
    });
}(window.angular));
