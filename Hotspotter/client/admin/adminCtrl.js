(function (angular) {
    'use strict';
    angular
        .module('hotspotter.adminCtrl', [])
        .factory('adminCtrl',
            function adminCtrl($http, lodash) {

                //"Global Variables"
                var vm = this;
                vm.files = [];
                vm.repos = [];
                vm.loading = false;

                return {
                    clearFiles: clearFiles,
                    listFiles: listFiles,
                    deleteRepo: deleteRepo
                };

                //Hits api endpoint to list all saved files for a given repo
                function listFiles(url) {
                    vm.loading = true;
                    return $http.get("/api/file/" + encodeURIComponent(url)).then(function (response) {
                        vm.files = response.data;
                        vm.loading = false;
                    });

                }

                //Hits api endpoint to delete a repo
                function deleteRepo(url) {
                   

                }

                //Hits api endpoint to delete saved metadata for a given repo
                function clearFiles(url) {
                    vm.loading = true;
                    return $http.delete("/api/file/" + encodeURIComponent(url)).then(function () {
                        vm.files = [];
                        vm.loading = false;
                    });
                }
            });
}(window.angular));
