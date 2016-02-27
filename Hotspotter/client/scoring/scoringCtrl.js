(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.scoringCtrl', ['nvd3']);
    ngModule.controller('scoringCtrl', function ($scope, $resource) {

        //"Global Variables"
        var vm = this;
        var Repo = $resource("/api/repo");
        
        vm.list = true;
        vm.results = false;
        vm.div = false;

        vm.repo = {};
        vm.repos = [];
        vm.data = [];

        //"Global Functions"
       vm.scoreRepo = scoreRepo;
       vm.scoreDiv = scoreDiv;

        //Anything that needs to be instantiated on page load goes in the init
        function init() {
            listRepos();
        }
        init();

        function listRepos() {
            vm.repos = Repo.query();
        }

        function scoreDiv(repoURL) {
            var Score = $resource("/api/scoring/:repoUrl/:sections", {}, {'query': {method: 'GET', isArray: false}});

            vm.list = false;
            vm.div = true;
           
            vm.file = Score.query({repoUrl : repoURL, sections : 100}, function () {
                fileGraph(vm.file);
                console.log(vm.data);
            });
        }

        function scoreRepo(repoURL) {
            var Score = $resource("/api/scoring/:repoUrl", {}, {'query': {method: 'GET', isArray: false}});

            vm.list = false;
            vm.results = true;
            
            vm.repo = Score.query({repoUrl : repoURL}, function () {
                console.log(vm.repo);
            });
        }

        function fileGraph(data) {
        vm.options = {
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
                text: 'File lifetime'
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


            for (var i = 0; i < data.Files.length; i++) {
                var points = [];
                var commits = [];
                var bcommits = [];
                var file = data.Files[i].FullPath.replace(/.*\//g,'');
                for (var j = 0; j < data.Files[i].Scores.length; j++) {
                    points.push({x: data.Files[i].Scores[j].Time, y: 1-data.Files[i].Scores[j].Score});
                }
                for (j = 0; j < data.Files[i].Commits.length; j++) {
                    if (data.Files[i].Commits[j].BugFix)
                        bcommits.push({x: data.Files[i].Commits[j].TimeMs, y: 1});
                    else
                        commits.push({x: data.Files[i].Commits[j].TimeMs, y: 1});
                }
                var graph = [];
                if (points.length > 0) {
                    graph.push({
                        yAxis : 1,
                        type : 'line',
                        values : points,
                        key : file,
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
                vm.data.push(graph);
            }
        }
    });
}(window.angular));
