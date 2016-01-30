var scoringService = require('./scoringService')
var Repo = require('../repository/repoModel')
var assert = require('assert')

describe('scoring', function () {
	describe('#scoringAlgorithm()', function() {
		it('scoringAlgorithm correctly calculates score based on 1 / (1 + e^(-12t+12))', function (done) {
			var repo = new Repo(
			{
				LastModified: "2012-12-05 19:52:20 -0700",
				FirstModified: "2011-11-03 19:52:20 -0700",
				Files: 	[
						{FullPath:'/tempProjects/hashsha1/dir1/dir2/file1', Commits: 
							[
							{Time: "2012-12-03 19:52:20 -0700"},
							{Time: "2012-12-04 19:52:20 -0700"},
							{Time: "2012-12-05 19:52:20 -0700"}
							]
						},
						{FullPath:'/tempProjects/hashsha1/dir1/file2', Commits: 
							[
							{Time: "2011-11-03 19:52:20 -0700"}
							]
						},
						{FullPath:'/tempProjects/hashsha1/dir1/dir2/dir3/file3', Commits: 
							[
							{Time: "2012-12-05 19:52:20 -0700"}
							]
						}	
						]
			}
			)
			scoringService.scoringAlgorithm(repo, function(res, err) {
				assert.equal(repo.Files[0].Score, 1.4773920721642089)
				assert.equal(repo.Files[1].Score, 0.00000614417460221472)
				assert.equal(repo.Files[2].Score, 0.5)
				done()
			})
		})
	}),
	describe('#normalizeScore()', function() {
		it('normalizeScore lowest values to be 1 and highest value to be 0', function (done) {
			var repo = new Repo(
			{
				Files: 	[
						{Score : 2},
						{Score : 6},
						{Score : 10},
						]
			}
			)
			scoringService.normalizeScore(repo, function(res, err) {
				assert.equal(repo.Files[0].Score, 1)
				assert.equal(repo.Files[1].Score, 0.5)
				assert.equal(repo.Files[2].Score, 0)
				done()
			})
		})
	})
})