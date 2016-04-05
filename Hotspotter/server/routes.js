var repoCtrl = require('./repository/repoCtrl')
var fileCtrl = require('./file/fileCtrl')
var scoringCtrl = require('./scoring/scoringCtrl')

module.exports = function(app) {

// =============================Server Routes ===========================================================
    //Repo Api Endpoints
    app.get('/api/repo', repoCtrl.list)
    app.post('/api/repo/:repoUrl', repoCtrl.create)
    app.get('/api/repo/:repo', repoCtrl.view)
    app.delete('/api/repo/:repoUrl', repoCtrl.clear)
    app.get('/api/repo/scan/:repoUrl', repoCtrl.scan)
    app.get('/api/repo/score/:repoUrl/:sections', repoCtrl.score)
    app.get('/api/repo/update/:repoUrl', repoCtrl.update)

    //File Api Endpoints
    app.get('/api/file/:repoUrl', fileCtrl.list)
    app.delete('/api/file/:repoUrl', fileCtrl.clear)

    //Scoring Api Endpoints
    app.get('/api/scoring/:repoUrl', scoringCtrl.score)
    app.get('/api/scoring/:repoUrl/:sections', scoringCtrl.scoreSection)

//============================= Frontend Routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendFile('index.html', { root: './client' })
    })

}