(function () {
    'use strict';

    describe('fileViewCtrl', function () {
        var $rootScope, scope, ctrl, $httpBackend;
        beforeEach(module('hotspotter'));

        beforeEach(inject(function (_$rootScope_, _$httpBackend_, $controller) {
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;

            ctrl = $controller('fileViewCtrl', {
                $scope: scope
            });
        }));

        beforeEach(function () {
            // Setup spies
            spyOn(ctrl, 'listRepos');
        });

        describe('controller', function () {
            it('should be defined', function () {
                expect(ctrl).toBeDefined();
            });
            it('should initialize variables', function () {
                expect(ctrl.repos.length).toBe(0);
            });
        });

        describe('init', function () {

            it('initialize and call listRepos ', function () {
                $httpBackend.expectGET('/api/repo').respond({success: '202'});
                $httpBackend.expectGET('/api/repo').respond({success: '202'});

                ctrl.init();

                $httpBackend.flush();
            });
        });

        describe('listRepos', function () {
            var expectedResponse = [{id: 12345, url: "https://github.com/myuser/myrepo.git"}];

            it('should return a list of repos ', function () {
                $httpBackend.expectGET('/api/repo').respond(expectedResponse);

                ctrl.listRepos();

                $httpBackend.flush();

                expect(ctrl.repos.length).toEqual(1);
                expect((angular.equals(ctrl.repos[0], expectedResponse)));
            });
        });
        describe('viewRepository', function () {
            var givenURL = 'https://github.com/myuser/myrepo.git';
            var repoList = [{id: 12345, url: "https://github.com/myuser/myrepo.git"}];
            var expectedResponse = [{
                folders: [
                    {
                        name: 'Folder 1', files: [{name: 'File 1.jpg'}, {name: 'File 2.png'}],
                        folders: [{name: 'Subfolder 1', files: [{name: 'Subfile 1'}]},
                            {name: 'Subfolder 2'}, {name: 'Subfolder 3'}
                        ]
                    }, {name: 'Folder 2', files: [], folders: []}
                ]
            }];


            it('should add the repo to the database and call list repos ', function () {
                $httpBackend.expectGET('/api/repo').respond(repoList);
                $httpBackend.flush();

                $httpBackend.expectGET('/api/repo/' + encodeURIComponent(givenURL)).respond(expectedResponse);

                ctrl.viewRepository(givenURL);

                $httpBackend.flush();

                expect((angular.equals(scope.structure[0], expectedResponse)));



            });
        });
    });

}());


