(function() {
    'use strict';

    describe('adminCtrl', function() {
        var $rootScope, scope, ctrl, $httpBackend;
        beforeEach(module('hotspotter'));

        beforeEach(inject(function(_$rootScope_, _$httpBackend_,$controller) {
            $rootScope      = _$rootScope_;
            scope           = $rootScope.$new();
            $httpBackend    =_$httpBackend_;

            ctrl = $controller('adminCtrl',{
                $scope: scope
            });
        }));

        beforeEach(function() {
            // Setup spies
            spyOn(ctrl,'listRepos');
        });

        describe('controller', function() {
            it('should be defined', function() {
                expect(ctrl).toBeDefined();
            });
            it('should initialize variables', function() {
                expect(ctrl.repos.length).toBe(0);
            });
        });

        describe('init', function() {

            it('initialize and call listRepos ', function() {
                $httpBackend.expectGET('/api/repo').respond({success: '202'});
                $httpBackend.expectGET('/api/repo').respond({success: '202'});
                ctrl.init();

                $httpBackend.flush();
            });
        });

        describe('listRepos', function() {
            var expectedResponse = [{id: 12345, url: "https://github.com/myuser/myrepo.git"}];

            it('should return a list of repos ', function() {
                $httpBackend.expectGET('/api/repo').respond(expectedResponse);

                ctrl.listRepos();

                $httpBackend.flush();

                expect(ctrl.repos.length).toEqual(1);
                expect((angular.equals(ctrl.repos[0], expectedResponse)));
            });
        });
        describe('listFiles', function() {
            var givenUrl = "https://github.com/myuser/myrepo.git";
            var expectedResponse = [{id: 12345, file: "myFile"}];

            it('should return a list of repos ', function() {
                $httpBackend.expectGET('/api/repo').respond("success");
                $httpBackend.expectGET("/api/file/" + encodeURIComponent(givenUrl)).respond(expectedResponse);

                ctrl.listFiles(givenUrl);

                $httpBackend.flush();

                expect(ctrl.files.length).toEqual(1);
                expect((angular.equals(ctrl.files[0], expectedResponse)));
            });
        });

        describe('clearFiles', function() {
            var givenUrl = "https://github.com/myuser/myrepo.git";


            it('delete all files for a repo ', function() {
                $httpBackend.expectGET('/api/repo').respond('success');
                $httpBackend.expectDELETE("/api/file/" + encodeURIComponent(givenUrl)).respond('success');

                ctrl.clearFiles(givenUrl);
                $httpBackend.flush();

                expect(ctrl.files.length).toEqual(0);

            });
        });
    });

}());
