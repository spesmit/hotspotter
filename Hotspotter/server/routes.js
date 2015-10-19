module.exports = function(app) {
	var repositoryController = require('./controllers/repositoryCtrl');
// =============================Server Routes ===========================================================
   // stub api call for frontend
   app.post('/api/repository', repositoryController.create);
//============================= Frontend Routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendFile('index.html', { root: './client' });
    });

};