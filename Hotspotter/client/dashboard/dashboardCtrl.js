(function () {
    angular
        .module('hotspotter.dashboardCtrl', [])
        .controller('dashboardCtrl', dashboardCtrl);

    function dashboardCtrl($http, $scope, lodash) {

        //"Global Variables", 'hotspotter.fileViewCtrl'  fileViewCtrl,
        var vm = this;
        vm.success = false;
        vm.loading = false;
        vm.loadingMessage = 'Loading';
        vm.repos = [];
        vm.selected = {};
        vm.advanced = false;
        vm.files = false;
        vm.adding = true;

        vm.graph = false;
        vm.index = 0;
        vm.file = {};
        vm.graph_options = {};
        vm.graph_data = {};

        vm.StatusEnum = {
           '-1': 'False',
            '0': 'In progress',
            '1': 'True'
        };      

        //"Global Functions"
        vm.addRepository = addRepository;
        vm.listRepos = listRepos;
        //vm.scanRepo = scanRepo;
        vm.updateRepo = updateRepo;
        vm.exportData = exportData;
        vm.deleteRepo = deleteRepo;
        vm.scoreRepo = scoreRepo;
        vm.selectRepo = selectRepo;
        vm.clearRepo = clearRepo;
        vm.viewRepository = viewRepository;
        vm.clearView = clearView;
        vm.fileGraph = fileGraph;

        vm.init = init;

        //Anything that needs to be instantiated on page load goes in the init
        function init() {
            vm.listRepos();
        }

        init();


        function selectRepo(url, status) {
            vm.adding = false;
            vm.advanced = true;
            
            console.log(status);

            var score = "Score"; 
            var scan = "Scan";

            if (status.score > 0) score = "Rescore";

            vm.selected = {
                URL: url,
                Status: status,
                Options : {
                    Score : score,
                    Scan : scan
                }
            };
    

        }

        function clearRepo() {
            vm.adding = true;
            vm.advanced = false;
            vm.selected = {};
            listRepos();
        }

        // function scanRepo(repoUrl) {
        //    vm.loading = true;
        //     $http.get('/api/repo/scan/' + encodeURIComponent(repoUrl)).then( function (response){
        //         console.log(response.data);
        //         vm.loading = false;
        //         vm.selected.Options.Scan = "Rescan";
        //     });
        // }

        function updateRepo(repoUrl) {
            
            vm.loading = true;
            $http.get('/api/repo/update/'+ encodeURIComponent(repoUrl)).then( function (response){
                console.log(response.data);
                clearRepo();
                vm.loading = false;
            });
        }

        function scoreRepo(repoUrl, snapshots) {
            vm.loading = true;
            $http.get('/api/repo/score/'+ encodeURIComponent(repoUrl) + '/' +  encodeURIComponent(snapshots)).then( function (response){
                console.log(response.data);
                vm.loading = false;
                vm.selected.Status.score = true;
                vm.selected.Options.Score = "Rescore";
            });
        }

        function removeRepo(repoUrl) {
            vm.loading = true;
            $http.delete('/api/repo/'+ encodeURIComponent(repoUrl)).then( function (response){
                var index = lodash.findIndex(vm.repos, {'URL': repoUrl});
                vm.repos.splice(index, 1);
                clearRepo();
                vm.loading = false;
            });
        }

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

        function viewRepository(repoURL) {
            // list of file paths

            vm.adding = false;
            vm.advanced = false;
            vm.loading = true;

            $http.get('/api/repo/' + encodeURIComponent(repoURL)).then(function (response){

                // Example structure
                /*$scope.structure = { folders: [
                 { name: 'Folder 1', files: [{ name: 'File 1.jpg' }, { name: 'File 2.png' }],
                 folders: [{ name: 'Subfolder 1', files: [{ name: 'Subfile 1' }] },
                 { name: 'Subfolder 2' },{ name: 'Subfolder 3' }
                 ]},{ name: 'Folder 2', files: [], folders: [] }
                 ]};*/

                 console.log(response.data);

                vm.index = response.data.files[0].score.length - 1;
                $scope.structure = response.data;

                console.log(vm.index);

                $scope.options = {

                    onFileSelect: function(file, breadcrums) {
                        $scope.breadcrums = breadcrums;
                        vm.selectedFile = file;
                    }
                };
                vm.files = true;
                vm.loading = false;
            });

        }

        function clearView(){
            vm.graph = false;
            vm.files = false;
            vm.advanced = true;
            vm.graph_options = {};
            vm.graph_data = {};
            $scope.structure = [];
        }

        function fileGraph(data) {
            vm.graph = true;

            var repo_start;
            if (data.score.length > 1) repo_start = data.score[0].Time - (data.score[1].Time - data.score[0].Time); //first commit
            else repo_start = data.commits[data.commits.length-1].TimeMs; //first commit on file
            console.log(repo_start);

            vm.graph_options = {
            chart: {
                type: 'multiChart',
                height: 400,
                margin : {
                    top: 20,
                    right: 65,
                    bottom: 75,
                    left: 65
                },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                lines1 : {
                    x : function (d) { return d.x; },
                    y : function (d) { return d.y; },
                    forceY: [0,1],
                    forceX: [repo_start]
                },

                xAxis: {
                    axisLabel: 'Time',
                    tickFormat: function(d){
                        return d3.time.format('%x')(new Date(d));
                    },
                    rotateLabels: 30
                },
                yAxis1: {
                    axisLabel: 'Score (Cold to Hot)',
                    tickFormat: function(d){
                        return d3.format('.2f')(d);
                    }
                },
                duration : 0,
               
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: data.name + ' lifetime'
            },
            "styles": {
                "classes": {
                  "with-3d-shadow": false,
                  "nv-line": false,
                  "gallery": false
                },
                "css": {}
              }
            };

            console.log(data);

            var points = [];
            var commits = [];
            var bcommits = [];

            for (var i = 0; i < data.score.length; i++) {
                points.push({x: data.score[i].Time, y: 1-data.score[i].Score});
            }
            for (var j = 0; j < data.commits.length; j++) {
                if (data.commits[j].BugFix)
                    bcommits.push({x: data.commits[j].TimeMs, y: 1});
                else
                    commits.push({x: data.commits[j].TimeMs, y: 1});
            }
            var graph = [];
            if (points.length > 0) {
                graph.push({
                    yAxis : 1,
                    type : 'line',
                    values : points,
                    key : data.name,
                    color : 'black'
                });
            }
            if (commits.length > 0) {
                graph.push({
                    yAxis : 1,
                    type : 'line',
                    values : commits,
                    key : 'Commits',
                    color : "blue"
                });
            }
            if (bcommits.length > 0) {
                graph.push({
                    yAxis : 1,
                    type : 'line',
                    values : bcommits,
                    key : 'Fix Commits',
                    color : "red"
                });
            }
            vm.graph_data = graph;

        }

        // function scanRepo(repoUrl){
        //     vm.loadingMessage = 'Scanning';
        //     vm.loading = true;
        //     $http.get('/api/repo/scan/' + encodeURIComponent(repoUrl)).then(function () {
        //         vm.loading = false;
        //     });
        // }
        
        // function updateRepo(repoUrl){
        //     vm.loadingMessage = 'Updating';
        //     vm.loading = true;
        //     $http.get('/api/repo/update/' + encodeURIComponent(repoUrl)).then(function (response) {
        //         console.log(response.data);
        //         vm.loading = false;
        //     });
            
        // }

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
