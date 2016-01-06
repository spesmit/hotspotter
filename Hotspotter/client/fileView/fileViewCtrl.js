(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.fileViewCtrl', ['AxelSoft']);
    ngModule.controller('fileViewCtrl', function ($scope, $resource, fileViewService) {
        // Do stuff
        var Repo = $resource("/api/repo");

        $scope.files = false;
        $scope.database = true;
        $scope.items = Repo.query({});

        // Example stucture
        /*$scope.structure = { folders: [
         { name: 'Folder 1', files: [{ name: 'File 1.jpg' }, { name: 'File 2.png' }],
         folders: [{ name: 'Subfolder 1', files: [{ name: 'Subfile 1' }] },
         { name: 'Subfolder 2' },{ name: 'Subfolder 3' }
         ]},{ name: 'Folder 2', files: [], folders: [] }
         ]};*/

        $scope.viewRepository = function (url) {
            // list of file paths
            $scope.files = true;
            $scope.database = false;

            // Fetch file structure from API endpoint
            var Repo = $resource("/api/repo/:repoUrl",
                                {},
                                {'query': {method:'GET', isArray:false}});
            var repo = Repo.query({repoUrl: "url"}, function () {

                // create json object in tree format fome path array
                // $scope.structure = fileViewService.ParsingAPI(repo);
                $scope.structure = repo;
                $scope.options = {
                    onNodeSelect: function (node, breadcrums) {
                        $scope.breadcrums = breadcrums;

                    }

                };
                console.log($scope.structure);
                console.log($scope.options);
            });

        };
    });
}(window.angular));