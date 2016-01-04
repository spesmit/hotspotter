var repoCtrl = require('./repository/repoCtrl');

module.exports = function(app) {

// =============================Server Routes ===========================================================
   app.get('/api/repo', repoCtrl.list);
   app.post('/api/repo', repoCtrl.create);

   app.get('/api/repo/:repo', repoCtrl.view);
   //
//============================= Frontend Routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendFile('index.html', { root: './client' });
    });

};