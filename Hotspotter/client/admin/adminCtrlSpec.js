'use strict';
describe('hotspotter.adminCtrl', function(){
    var adminCtrl,
        $httpBackend,
        $resource,
        scope;


    //mock Application to allow us to inject our own dependencies
    beforeEach(angular.mock.module('hotspotter'));

    beforeEach(angular.mock.inject(function($rootScope, $controller, _$httpBackend_){
        $httpBackend = _$httpBackend_;
        $httpBackend.when('GET', 'Users/users.json').respond([{id: 1, name: 'Bob'}, {id:2, name: 'Jane'}]);

        //create an empty scope
        scope = $rootScope.$new();
        //declare the controller and inject our empty scope
        adminCtrl = $controller('adminCtrl', {$scope: scope});
    }));

    describe('listRepos()', function(){
        it('should list the repos', function (){
            console.log("hello world")

        });
    });
});