//'use strict';
//
//describe('adminCtrl', function () {
//
//    beforeEach(function () {
//        module('hotspotter.adminCtrl');
//        module('hotspotter');
//
//
//    });
//    describe('listRepos()', function () {
//        it('should return a json object representing a repository',
//            inject(function (_$httpBackend_, $rootScope, $controller) {
//                var scope = $rootScope.$new();
//                var mockBackend = _$httpBackend_;
//                var expectedResponse = {id: 12345, url: "https://github.com/myuser/myrepo.git"};
//
//                mockBackend.expectGET('/api/repo').respond([expectedResponse]);
//
//                var ctrl = $controller('adminCtrl', {$scope: scope});
//
//                mockBackend.flush();
//
//                expect(ctrl.repos.length).toEqual(1);
//                console.log(ctrl.repos[0]);
//                expect((angular.equals(ctrl.repos[0], expectedResponse)));
//            }));
//    });
//
//});
