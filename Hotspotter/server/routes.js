var repoCtrl = require('./repository/repoCtrl');
var fileCtrl = require('./file/fileCtrl');

module.exports = function(app) {

// =============================Server Routes ===========================================================
   app.get('/api/repo', repoCtrl.list);
   app.post('/api/repo', repoCtrl.create);
   app.get('/api/file', fileCtrl.list);
   app.get('/api/repo/:repo', repoCtrl.view);
   app.delete('/api/file', fileCtrl.clear);
   //
//============================= Frontend Routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendFile('index.html', { root: './client' });
    });

};