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
        vm.last = 10;
        vm.index = 0;
        vm.inc_disable = true;
        vm.dec_disable = false;
        vm.file = {};
        vm.active = [];

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



                vm.index = response.data.files[0].scores.length - 1;
                for (var i = 0; i <= vm.index; i++) {
                    vm.active.push({index: i, show: false});
                }
                vm.active[vm.index].show = true;

                vm.file = response.data.files[0];

                $scope.structure = response.data;

                $scope.options = {
                    onNodeSelect: function (node, breadcrums) {
                        vm.breadcrums = breadcrums;
                    }
                };
                vm.files = true;
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
            vm.active[vm.index].show = false;
            vm.index++;
            vm.active[vm.index].show = true;
            if (vm.index >= vm.last-1) {
                vm.inc_disable = true;
                vm.index = vm.last-1;
            } else {
                vm.inc_disable = false;
                vm.dec_disable = false;
            }
        }

        function decrement() {
            vm.active[vm.index].show = false;
            vm.index--;
            vm.active[vm.index].show = true;
            if (vm.index <= 0) {
                vm.index = 0;
                vm.dec_disable = true;
            } else {
                vm.inc_disable = false;
                vm.dec_disable = false;
            }
        }

    });
}(window.angular));
