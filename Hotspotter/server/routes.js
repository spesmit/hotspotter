module.exports = function(app) {
// =============================Server Routes ===========================================================
   //TODO: These will be our api routes
   var repo = require('./models/repo');

   app.get('/api/repos', function(req, res) {

	   repo.find(function(err, repos) {
	   		if (err)
	   			res.send(err);

	   		res.json(repo);

	   });
	});
   //
//============================= Frontend Routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendFile('index.html', { root: './client' });
    });

};