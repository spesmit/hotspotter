/**
 * Created by SmithS on 01/13/2016.
 */

var File = require('./fileModel')
var Repo = require('../repository/repoModel')
var fileService = require('./fileService')

module.exports.list = function (req, res) {
    var repoURL = req.params.repoUrl

    fileService.listFiles(repoURL, function (err, files) {
        if (err) {
            console.log("ERR: " + err)
            res.json([])
        } else {
            res.json(files)
        }
    })
}

module.exports.clear = function (req, res) {
    var repoURL = req.params.repoUrl

    fileService.removeFiles(repoURL, function (err, repo) {
        if (err) {
            console.log("ERR: " + err)
            res.json({})
        } else {
            console.log('\n' + repo.URL + ' files removed... \n');
            res.write(JSON.stringify({ status: 'DELETED' }));
            res.end();
        }
    })
}
