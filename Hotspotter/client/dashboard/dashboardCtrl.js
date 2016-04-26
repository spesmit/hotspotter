(function () {
    angular
        .module('hotspotter.dashboardCtrl', ['hotspotter.dataCtrl', 'hotspotter.repositoryCtrl'])
        .controller('dashboardCtrl', dashboardCtrl);

    function dashboardCtrl($http, $scope,  dataCtrl, repositoryCtrl) {

        //"Global Variables", 'hotspotter.fileViewCtrl'  fileViewCtrl,
        var vm = this;
        vm.success = false;
        vm.loading = false;
        vm.repos = [];

        //"Global Functions"
        vm.addRepository = addRepository;
        vm.listRepos = listRepos;
        vm.init = init;

        //Anything that needs to be instantiated on page load goes in the init
        function init() {
            vm.listRepos();
        }

        init();

        // Add a repository
        function addRepository(repoUrl) {
            vm.loading = true;
            return $http.post("/api/repo/" + encodeURIComponent(repoUrl)).then(function () {
                vm.success = true;
                vm.addedRepo = vm.repoUrl;
                vm.repoUrl = '';
                vm.loading = false;
                listRepos();
            });
        }

        //Lists all repos that have been checked out
        function listRepos() {
            return $http.get('/api/repo').then(function (response) {
                vm.repos = response.data;

            });
        }
    }
})();
