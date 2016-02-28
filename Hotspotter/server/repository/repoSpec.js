/**
 * Created by SmithS on 01/20/2016.
 */

var repoService = require('./repoService')
var Repo = require('./repoModel')
var assert = require('assert')

describe('repo', function () {
	describe('#createTree()', function() {
		it('should create empty file tree when given a empty array of file paths', function (done) {
			var emptyTree = {folders: [], files: []}
			repoService.createTree([], function (err, res) {
				assert.deepEqual(res, emptyTree)
				done()
			})
		})
		it('should create file tree with one path when given an array with one file paths', function (done) {
			var oneTree = {folders: [{name:'dir1/', folders: [{ name:'dir2/', folders: [], files: [{name:'file1',score:[0.5],last_touched_by:'Bob',last_updated:'Mon Dec 14 2015 03:35:33 GMT-0600 (CST)'}]}], files: []}], files: []}
			repoService.createTree([{FullPath:'/tempProjects/hashsha1/dir1/dir2/file1', Scores: [0.5], Commits: [{Author: 'Bob', Time: 'Mon Dec 14 2015 03:35:33 GMT-0600 (CST)'}]}], function (err, res) {
				assert.deepEqual(res, oneTree)
				done()
			})
		})
		it('should create file tree with many path when given an array with many file paths', function (done) {
			var manyTree = {folders: [{name:'dir1/',
							folders: [{ name:'dir2/',
							 folders: [{ name:'dir3/',
							  folders: [], files: [{name:'file3',score:[0.25],last_touched_by:'Jane',last_updated:'Mon Dec 14 2015 03:35:33 GMT-0600 (CST)'}]}], files: [{name:'file1',score:[0.5],last_touched_by:'Bob',last_updated:'Mon Dec 14 2015 03:35:33 GMT-0600 (CST)'}]}], files: [{name:'file2',score:[0.75],last_touched_by:'Dave',last_updated:'Mon Dec 14 2015 03:35:33 GMT-0600 (CST)'}]}], files: []}
			repoService.createTree([
				{FullPath:'/tempProjects/hashsha1/dir1/dir2/file1', Scores: [0.5], Commits: [{Author: 'Bob', Time: 'Mon Dec 14 2015 03:35:33 GMT-0600 (CST)'}]},
				{FullPath:'/tempProjects/hashsha1/dir1/file2', Scores: [0.75], Commits: [{Author: 'Dave', Time: 'Mon Dec 14 2015 03:35:33 GMT-0600 (CST)'}]},
				{FullPath:'/tempProjects/hashsha1/dir1/dir2/dir3/file3', Scores: [0.25], Commits: [{Author: 'Jane', Time: 'Mon Dec 14 2015 03:35:33 GMT-0600 (CST)'}]}
									], function (err, res) {
				assert.deepEqual(res, manyTree)
				done()
			})
		})
	})
})
