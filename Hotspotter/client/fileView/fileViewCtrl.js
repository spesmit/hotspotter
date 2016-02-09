(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.fileViewCtrl', ['AxelSoft']);
    ngModule.controller('fileViewCtrl', function ($scope, $http) {

        //"Global Variables"
        var vm = this;
        vm.files = false;
        vm.database = true;
        vm.repos = [];

        //"Global Functions"
        vm.viewRepository = viewRepository;
        vm.listRepos = listRepos;
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

            $http.get('/api/repo/' + encodeURIComponent(repoURL)).then(function (response){

                // Example structure
                /*$scope.structure = { folders: [
                 { name: 'Folder 1', files: [{ name: 'File 1.jpg' }, { name: 'File 2.png' }],
                 folders: [{ name: 'Subfolder 1', files: [{ name: 'Subfile 1' }] },
                 { name: 'Subfolder 2' },{ name: 'Subfolder 3' }
                 ]},{ name: 'Folder 2', files: [], folders: [] }
                 ]};*/

                $scope.structure = response.data;
                $scope.options = {
                    onNodeSelect: function (node, breadcrums) {
                        vm.breadcrums = breadcrums;

                    }
                };
            });

        }
        function listRepos() {
            $http.get('/api/repo').then( function (response){
                vm.repos = response.data;

            });
        }
    });
}(window.angular));
