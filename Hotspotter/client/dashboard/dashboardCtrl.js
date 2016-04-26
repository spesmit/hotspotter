(function () {
    angular
        .module('hotspotter.dashboardCtrl', [])
        .controller('dashboardCtrl', dashboardCtrl);

    function dashboardCtrl($http, lodash) {

        //"Global Variables", 'hotspotter.fileViewCtrl'  fileViewCtrl,
        var vm = this;
        vm.success = false;
        vm.loading = false;
        vm.loadingMessage = 'Loading';
        vm.repos = [];

        //"Global Functions"
        vm.addRepository = addRepository;
        vm.listRepos = listRepos;
        vm.scanRepo = scanRepo;
        vm.updateRepo = updateRepo;
        vm.exportData = exportData;
        vm.deleteRepo = deleteRepo;

        vm.init = init;

        //Anything that needs to be instantiated on page load goes in the init
        function init() {
            vm.listRepos();
        }

        init();

        // Add a repository
        function addRepository(repoUrl) {
            vm.loadingMessage = 'Checking Out';
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

        function scanRepo(repoUrl){
            vm.loadingMessage = 'Scanning';
            vm.loading = true;
            $http.get('/api/repo/scan/' + encodeURIComponent(repoUrl)).then(function () {
                vm.loading = false;
            });
        }
        
        function updateRepo(repoUrl){
            vm.loadingMessage = 'Updating';
            vm.loading = true;
            $http.get('/api/repo/update/' + encodeURIComponent(repoUrl)).then(function (response) {
                console.log(response.data);
                vm.loading = false;
            });
            
        }
        function exportData(repoUrl){
            /*
             var Csv = $resource("/api/export/:repoUrl", {}, {'query': {method: 'GET', isArray: false}});
             vm.csv = Csv.query({repoUrl : repoURL}, function() {
             console.log(vm.csv);
             });
             */
            window.open("/api/export/" + encodeURIComponent(repoUrl), '_blank');

        }
        
        function deleteRepo(repoUrl){
            vm.loadingMessage = 'Deleting';
            vm.loading = true;
            return $http.delete('/api/repo/' + encodeURIComponent(repoUrl)).then(function () {
                var index = lodash.findIndex(vm.repos, {'URL': repoUrl});
                vm.repos.splice(index, 1);
                vm.loading = false;
            });
        }
    }
})();
