var Repo            = require('../repository/repoModel')
var repoService     = require('../repository/repoService')
var scoringService  = require('../scoring/scoringService')

module.exports.export = function (req, res) {
    var repoURL = req.params.repoUrl

    repoService.retrieveRepo(repoURL, function (err, repo) {
        if (err) console.log("ERR: " + err)
        else {
            scoringService.scoreSections(repo, 100, function (err, repo) {
                if (err) console.log("ERR: " + err)
                else {
                    scoringService.normalizeSection(repo, {"Offset": 0}, function (err, repo) {
                        if (err) console.log("ERR: " + err)
                        else {
                            data = []
                            for(var i = 0; i < repo.Files.length; i++) {
                                file        = repo.Files[i];
                                filename    = file.FullPath.replace(/tempProjects\/[^\/]*\//,'')
                                commits     = file.Commits.length
                                last_touched= file.Commits[file.Commits.length - 1].Time
                                scores      = ""
                                for(var j = 0; j < file.Scores.length; j++) {
                                    scores += file.Scores[j].Score
                                    if(j != file.Scores.length - 1) {
                                        scores += ","
                                    }
                                }

                                row = { "filename": filename,
                                        "commits": commits,
                                        "last_touched": last_touched,
                                        "scores": scores
                                    }
                                data.push(row)
                            }

                            var csv = "filename, commits, last touched, scores\n"
                            for(var i = 0; i < data.length; i++) {
                                row = data[i]
                                csv +=  row.filename     + "," +
                                        row.commits      + "," +
                                        row.last_touched + "," +
                                        row.scores       + "\n"                                
                            }
                            console.log('Sending exported CSV...')
                            res.set('Content-Disposition: attachment; filename="export.csv"')
                            res.set('Content-Type', 'text/plain')
                            return res.send(csv)
                        }
                    })
                }
            })
        }
    })
}
                    

        /*
            scoringService.scoringAlgorithm(repo, function (err, repo) {
                if (err) console.log("ERR: " + err)
                else {
                    data    = []
                    for(var i = 0; i < repo.Files.length; i++) {
                        file        = repo.Files[i];
                        filename    = file.FullPath.replace(/tempProjects\/[^\/]*\//,'')
                        score       = file.Score
                        commits     = file.Commits.length
                        last_touched= file.Commits[file.Commits.length - 1]
                                             .Time
                        row = { "filename": filename,
                                "score":    score,
                                "commits":  commits,
                                "last_touched": last_touched }
                        data.push(row)
                    }

                    var csv = "filename, score, commits, last touched\n"
                    for(var i = 0; i < data.length; i++) {
                        row = data[i];
                        csv +=  row.filename     + "," +
                                row.score        + "," +
                                row.commits      + "," +
                                row.last_touched + "\n"
                    }
                    console.log('Sending exported CSV...')
                    res.set('Content-Disposition: attachment; filename="export.csv"')
                    res.set('Content-Type', 'text/plain')
                    return res.send(csv)
                }
            })
        */