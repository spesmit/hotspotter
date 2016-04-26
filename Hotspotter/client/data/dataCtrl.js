(function (angular) {
    'use strict';
    angular
        .module('hotspotter.dataCtrl', [])
        .factory('dataCtrl',
            function dataCtrl($resource) {

                //"Global Variables"
                var vm = this;
                
                vm.list = true;
                vm.results = false;
                vm.div = false;
                vm.loading = false;

                vm.repo = {};
                vm.repos = [];
                vm.data = [];

                //"Global Functions"
                return {
                    scoreRepo: scoreRepo,
                    scoreDiv: scoreDiv,
                    exportData: exportData
                };
                
                function scoreDiv(repoURL) {
                    var Score = $resource("/api/scoring/:repoUrl/:sections", {}, {
                        'query': {
                            method: 'GET',
                            isArray: false
                        }
                    });

                    vm.div = true;
                    vm.loading = true;

                    vm.repo = Score.query({repoUrl: repoURL, sections: 100}, function () {
                        console.log(vm.repo);
                        vm.loading = false;
                    });
                }

                function scoreRepo(repoURL) {
                    var Score = $resource("/api/scoring/:repoUrl", {}, {'query': {method: 'GET', isArray: false}});

                    vm.results = true;
                    vm.loading = true;

                    vm.repo = Score.query({repoUrl: repoURL}, function () {
                        console.log(vm.repo);
                        vm.loading = false;
                    });
                }

                function exportData(repoURL) {
                    /*
                     var Csv = $resource("/api/export/:repoUrl", {}, {'query': {method: 'GET', isArray: false}});
                     vm.csv = Csv.query({repoUrl : repoURL}, function() {
                     console.log(vm.csv);
                     });
                     */
                    window.open("/api/export/" + encodeURIComponent(repoURL), '_blank');
                }

            });
}(window.angular));
