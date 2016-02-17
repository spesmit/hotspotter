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
            var Score = $resource("/api/scoring/:repoUrl/:sections");

            vm.list = false;
            vm.div = true;
           
            vm.file = Score.query({repoUrl : repoURL, sections : 100}, function () {
                console.log(vm.file);
                fileGraph(vm.file);
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
                type: 'lineChart',
                height: 400,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Time (ns)'
                },
                yAxis: {
                    axisLabel: 'Score',
                    tickFormat: function(d){
                        return d3.format('.05f')(d);
                    },
                    axisLabelDistance: -10
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: 'Title for Line Chart'
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

            for (var i = 0; i < data.length; i++) {
                vm.data.push([data[i]]);
            }
        }
    });
}(window.angular));
