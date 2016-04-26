(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.fileViewCtrl', ['AxelSoft','nvd3']);
    ngModule.controller('fileViewCtrl', function ($scope, $http) {

        //"Global Variables"
        var vm = this;
        vm.files = false;
        vm.database = true;
        vm.graph = false;
        vm.repos = [];
        vm.loading = false;
        vm.index = 0;
        vm.file = {};
        vm.graph_options = {};
        vm.graph_data = {};


        //ADVANCED SETTINGS
        vm.database = true;
        vm.reposelected = false;
        vm.selected = {};

        //"Global Functions"
        vm.selectRepo = selectRepo;
        vm.scanRepo = scanRepo;
        vm.scoreRepo = scoreRepo;


        //"Global Functions"
        vm.viewRepository = viewRepository;
        vm.listRepos = listRepos;
        vm.clearView = clearView;
        vm.clearRepo = clearRepo;
        vm.fileGraph = fileGraph;
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
            vm.reposelected = false;

            $http.get('/api/repo/' + encodeURIComponent(repoURL)).then(function (response){

                // Example structure
                /*$scope.structure = { folders: [
                 { name: 'Folder 1', files: [{ name: 'File 1.jpg' }, { name: 'File 2.png' }],
                 folders: [{ name: 'Subfolder 1', files: [{ name: 'Subfile 1' }] },
                 { name: 'Subfolder 2' },{ name: 'Subfolder 3' }
                 ]},{ name: 'Folder 2', files: [], folders: [] }
                 ]};*/

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
        function listRepos() {
            $http.get('/api/repo').then( function (response){
                vm.repos = response.data;

            });
        }

        function clearView(){
            vm.database = true;
            vm.graph = false;
            vm.files = false;
            vm.graph_options = {};
            vm.graph_data = {};
            $scope.structure = [];
            clearRepo();

        }
        
   // ADANCED SETTINGS
        function selectRepo(url, status) {
            vm.database = false;
            vm.reposelected = true;

            if (typeof status === 'undefined') {
                status = {
                    scan : false,
                    score : false
                };
            }

            var score = "Score";
            var scan = "Scan";

            if (status.score) score = "Rescore";

            if (status.scan) scan = "Rescan";

            vm.selected = {
                URL: url,
                Status: status,
                Options : {
                    Score : score,
                    Scan : scan
                }
            };

            scanRepo();


        }
        
        function scanRepo(repoUrl) {
            vm.loading = true;
            $http.get('/api/repo/scan/' + encodeURIComponent(repoUrl)).then( function (response){
                console.log(response.data);
                vm.loading = false;
                vm.selected.Status.scan = true;
                vm.selected.Options.Scan = "Rescan";
            });
        }

        function clearRepo() {
            vm.database = true;
            vm.reposelected = false;
            vm.selected = {};
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

       
        

        //
        //
        //
        // GRAPH CODE
        //
        //
        //
        //
        //
        //
        //
        //
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

    });
}(window.angular));
