var repo_controller = require('./repository/repo_controller');

module.exports = function(app) {
	var repositoryController = require('./repository/repo_controller');
// =============================Server Routes ===========================================================
   app.get('/api/repo', repo_controller.list);
   app.post('/api/repo', repo_controller.create);

   app.get('/api/repo/:repo', repo_controller.view);
   //
//============================= Frontend Routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendFile('index.html', { root: './client' });
    });

};