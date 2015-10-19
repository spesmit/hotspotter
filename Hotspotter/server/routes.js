var repo_controller = require('./repository/repo_controller');

module.exports = function(app) {
	var repositoryController = require('./controllers/repositoryCtrl');
// =============================Server Routes ===========================================================
<<<<<<< HEAD
   //TODO: These will be our api routes
   app.get('/api/repo', repo_controller.list);
   app.post('/api/repo', repo_controller.create);
   //
=======
   // stub api call for frontend
   app.post('/api/repository', repositoryController.create);
>>>>>>> basic_frontend
//============================= Frontend Routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendFile('index.html', { root: './client' });
    });

};