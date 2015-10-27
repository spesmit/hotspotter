var repo_controller = require('./repository/repo_controller');

module.exports = function(app) {
	var repositoryController = require('./repository/repo_controller');
// =============================Server Routes ===========================================================
   //TODO: These will be our api routes
   app.get('/api/repo', repo_controller.list);
   app.post('/api/repo', repo_controller.create);
   //
//============================= Frontend Routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendFile('index.html', { root: './client' });
    });

};