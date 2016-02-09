(function() {
    'use strict';

    describe('dashboardCtrl', function() {
        var $rootScope, scope, ctrl, $httpBackend;
        beforeEach(module('hotspotter'));

        beforeEach(inject(function(_$rootScope_, _$httpBackend_,$controller) {
            $rootScope      = _$rootScope_;
            scope           = $rootScope.$new();
            $httpBackend    =_$httpBackend_;

            ctrl = $controller('dashboardCtrl',{
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
                expect(ctrl.success).toBe(false);
                expect(ctrl.repos.length).toBe(0);
            });
        });

        describe('init', function() {

            it('initialize and call listRepos ', function() {
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

        describe('addRepository', function() {
            var givenURL = 'https://github.com/myuser/myrepo.git';
            var initialResponse = [];
            var expectedResponse = [{id: 12345, url: "https://github.com/myuser/myrepo.git"}];

            it('should add the repo to the database and call list repos ', function() {
                $httpBackend.expectGET('/api/repo').respond(initialResponse);
                $httpBackend.flush();

                $httpBackend.expectPOST('/api/repo/' + encodeURIComponent(givenURL)).respond({success: '202'});
                $httpBackend.expectGET('/api/repo').respond(expectedResponse);

                ctrl.addRepository(givenURL).then(function() {
                    ctrl.listRepos();
                    expect(ctrl.success).toBe(true);
                    expect(ctrl.repoUrl).toBe('');
                    expect(ctrl.listRepos).toHaveBeenCalled();
                    expect((angular.equals(ctrl.repos[0], expectedResponse)));
                });
                $httpBackend.flush();
            });
        });
    });

}());
