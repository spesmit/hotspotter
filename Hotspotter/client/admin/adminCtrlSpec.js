'use strict';

describe('adminCtrl', function () {

    var $mockBackend;
    var adminCtrl;
    var scope;

    var expectedResponse = {id: 12345, url: "https://github.com/myuser/myrepo.git"};


    beforeEach(function () {
        module('hotspotter.adminCtrl');
        module('hotspotter');

    });

    beforeEach(inject(function ($injector) {
        $mockBackend = $injector.get($httpBackend);
        scope = $injector.get($rootScope).$new();
        var $controller = $injector.get('adminCtrl');

        $mockBackend.when('/api/repo').respond([expectedResponse]);
        $mockBackend.when('/api/file').respond([expectedResponse]);
        $mockBackend.when('/api/repo').respond([expectedResponse]);
        $mockBackend.when('/api/repo').respond([expectedResponse]);

        adminCtrl = $controller('adminCtrl', {$scope: scope});

    }));
        it('should return a json object representing a repository', function () {
            adminCtrl.listRepos();



            $mockBackend.flush();

            expect(adminCtrl.repos.length).toEqual(1);
            console.log(adminCtrl.repos[0]);
            expect((angular.equals(adminCtrl.repos[0], expectedResponse)));


        });
    });



//describe('listFiles()', function () {
//    it('should return a json object representing the files of a repository',
//        inject(function (_$httpBackend_, $rootScope, $controller) {
//
//            var scope = $rootScope.$new();
//            var mockBackend = _$httpBackend_;
//
//            var requestedURL = "https://github.com/myuser/myrepo.git";
//            var expectedResponse = {id: 12345, url: requestedURL, file: 'index.html'};
//
//            mockBackend.expectGET('/api/file/' + requestedURL).respond([expectedResponse]);
//
//            var ctrl = $controller('adminCtrl', {$scope: scope});
//            ctrl.listFiles(requestedURL);
//
//            mockBackend.flush();
//
//            expect(ctrl.files.length).toEqual(1);
//            console.log(ctrl.files[0]);
//            expect((angular.equals(ctrl.files[0], expectedResponse)));
//        }));
//});


