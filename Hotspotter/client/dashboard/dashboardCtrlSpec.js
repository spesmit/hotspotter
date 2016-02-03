describe('dashboardCtrl', function () {
    var scope, httpBackend, createController;
    // Set up the module
    beforeEach(module('hotspotter'));

    beforeEach(inject(function ($rootScope, $httpBackend, $controller) {
        httpBackend = $httpBackend;
        scope = $rootScope.$new();
        createController = function () {
            return $controller('dashboardCtrl', {
                '$scope': scope
            });
        };
    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });
    describe('listRepos', function () {
        it('should call listRepos and return all repos from the database', function () {
            var controller = createController();
            var expectedResponse = [{id: 12345, url: "https://github.com/myuser/myrepo.git"}];

            httpBackend.expect('GET', '/api/repo')
                .respond(expectedResponse);
            // have to use $apply to trigger the $digest which will
            // take care of the HTTP request
            scope.$apply(function () {
                controller.listRepos;
            });
            httpBackend.flush();
            expect(controller.repos).toEqual(expectedResponse);
        });
    });


    describe('addRepository', function () {

        it('should addRepository to the database', function () {
            var controller = createController();
            var givenURL = "https://github.com/myuser/myURLtoMyRepo.git";

            httpBackend.expect('POST', '/api/repo/' + encodeURIComponent(givenURL)).respond('success');
            httpBackend.when('GET', '/api/repo').respond('success');

            controller.addRepository(givenURL);

            httpBackend.flush();
            expect(controller.success).toBe(true);
        });
        it('should call listRepos', function() {
            var givenURL = "https://github.com/myuser/myURLtoMyRepo.git";
            var controller = createController();

            httpBackend.when('POST', '/api/repo/' + encodeURIComponent(givenURL)).respond('success');
            httpBackend.expect('GET', '/api/repo').respond('success');

            httpBackend.flush();
            controller.addRepository(givenURL).then(function(result) {
                expect(controller.listRepos).toHaveBeenCalled();
            });

        });
    });

});
