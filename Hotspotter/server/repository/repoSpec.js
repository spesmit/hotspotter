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
			var oneTree = {folders: [{name:'dir1/', folders: [{ name:'dir2/', folders: [], files: [{name:'file1',score:0.5,last_touched_by:'Bob',last_updated:'2015-10-13T10:57:42.000Z'}]}], files: []}], files: []}
			repoService.createTree([{FullPath:'/tempProjects/hashsha1/dir1/dir2/file1', Score: 0.5, Commits: [{Author: 'Bob'}], LastUpdated: '2015-10-13T10:57:42.000Z'}], function (err, res) {
				assert.deepEqual(res, oneTree)
				done()
			})
		})
		it('should create file tree with many path when given an array with many file paths', function (done) {
			var manyTree = {folders: [{name:'dir1/',
							folders: [{ name:'dir2/',
							 folders: [{ name:'dir3/',
							  folders: [], files: [{name:'file3',score:0.25,last_touched_by:'Jane',last_updated:'2015-10-13T10:57:42.000Z'}]}], files: [{name:'file1',score:0.5,last_touched_by:'Bob',last_updated:'2015-10-13T10:57:42.000Z'}]}], files: [{name:'file2',score:0.75,last_touched_by:'Dave',last_updated:'2015-10-13T10:57:42.000Z'}]}], files: []}
			repoService.createTree([
				{FullPath:'/tempProjects/hashsha1/dir1/dir2/file1', Score: 0.5, Commits: [{Author: 'Bob'}], LastUpdated: '2015-10-13T10:57:42.000Z'},
				{FullPath:'/tempProjects/hashsha1/dir1/file2', Score: 0.75, Commits: [{Author: 'Dave'}], LastUpdated: '2015-10-13T10:57:42.000Z'},
				{FullPath:'/tempProjects/hashsha1/dir1/dir2/dir3/file3', Score: 0.25, Commits: [{Author: 'Jane'}], LastUpdated: '2015-10-13T10:57:42.000Z'}
									], function (err, res) {
				assert.deepEqual(res, manyTree)
				done()
			})
		})
	})
})
