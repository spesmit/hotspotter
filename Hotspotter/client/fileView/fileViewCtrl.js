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

        //"Global Functions"
        vm.viewRepository = viewRepository;
        vm.listRepos = listRepos;
        vm.clearView = clearView;
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
            vm.selectedFile = false;

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

                    onNodeSelect: function(file, breadcrums) {
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
            vm.graph_options = {};
            vm.graph_data = {};
            $scope.structure = [];

        }

        function fileGraph(data) {
            vm.graph = true;

            vm.graph_options = {
            chart: {
                type: 'multiChart',
                height: 400,
                margin : {
                    top: 20,
                    right: 55,
                    bottom: 40,
                    left: 55
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
                    forceY: [0]
                },
                bars1: {
                    x : function (d) { return d.x; },
                    y : function (d) { return d.y; },
                    forceY: [0]
                },
                
                xAxis: {
                    axisLabel: 'Time (ns)'
                },
                yAxis1: {
                    axisLabel: 'Score',
                    tickFormat: function(d){
                        return d3.format('.05f')(d);
                    },
                    axisLabelDistance: -20
                },
                yAxis2: {
                    axisLabel: 'Bug Commits',
                    axisLabelDistance: 20
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
            subtitle: {
                enable: true,
                text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            caption: {
                enable: true,
                html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
                css: {
                    'text-align': 'justify',
                    'margin': '10px 13px 0px 7px'
                    }
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
                    color : "green"
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
                    key : 'Bug Commits',
                    color : "red"
                });
            }
            vm.graph_data = graph;

        }

    });
}(window.angular));
