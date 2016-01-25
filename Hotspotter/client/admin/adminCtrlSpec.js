describe('adminCtrl', function(){
    beforeEach(
        module('hotspotter'),
        module('hotspotter.adminCtrl'));

    describe('listRepos()', function(){
        it('should list the repos', inject(function($controller){
            var scope = {};
            var adminCtrl = $controller('adminCtrl' ,{
                $scope: scope
            });
            console.log("hello world")
        }));
    });
});