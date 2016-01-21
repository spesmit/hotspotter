(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.fileViewCtrl', ['AxelSoft']);
    ngModule.controller('fileViewCtrl', function ($scope, $resource) {

        //"Global Variables"
        var Repo = $resource("/api/repo");
        var vm = this;
        vm.files = false;
        vm.database = true;
        vm.items = [];

        //"Global Functions"
        vm.viewRepository = viewRepository;

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

            // Fetch file structure from API endpoint
            var Repo = $resource("/api/repo/:repoUrl", {}, {'query': {method: 'GET', isArray: false}});
            var repo = Repo.query({repoUrl: repoURL}, function () {

                // Example structure
                /*$scope.structure = { folders: [
                 { name: 'Folder 1', files: [{ name: 'File 1.jpg' }, { name: 'File 2.png' }],
                 folders: [{ name: 'Subfolder 1', files: [{ name: 'Subfile 1' }] },
                 { name: 'Subfolder 2' },{ name: 'Subfolder 3' }
                 ]},{ name: 'Folder 2', files: [], folders: [] }
                 ]};*/

                // Structure and Options must be bound to scope in order for treeview to find them.
                $scope.structure = repo;
                $scope.options = {
                    onNodeSelect: function (node, breadcrums) {
                        vm.breadcrums = breadcrums;

                    }

                };
                console.log($scope.structure);
                console.log($scope.options);
            });
        }

        function listRepos() {
            vm.items = Repo.query();
        }
    });
}(window.angular));
