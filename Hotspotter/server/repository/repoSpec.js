/**
 * Created by SmithS on 01/20/2016.
 */

var repoService = require('./repoService')
var Repo = require('./repoModel');
var assert = require('assert');

describe('repo', function () {
	describe('#createTree()', function() {
		it('should create empty file tree when given a empty array of file paths', function (done) {
			var emptyTree = {folders: [], files: []};
			repoService.createTree([], function (res, err) {	
				assert.deepEqual(res, emptyTree);
				done();
			});
		});
		it('should create file tree with one path when given an array with one file paths', function (done) {
			var oneTree = {folders: [{name:'dir1/', folders: [{ name:'dir2/', folders: [], files: [{name:'file1',score:0.5}]}], files: []}], files: []};
			repoService.createTree([{FullPath:'/tempProjects/hashsha1/dir1/dir2/file1', Score: 0.5}], function (res, err) {	
				assert.deepEqual(res, oneTree);
				done();
			});
		});
		it('should create file tree with many path when given an array with many file paths', function (done) {
			var manyTree = {folders: [{name:'dir1/', 
							folders: [{ name:'dir2/', 
							 folders: [{ name:'dir3/', 
							  folders: [], files: [{name:'file3',score:0.25}]}], files: [{name:'file1',score:0.5}]}], files: [{name:'file2',score:0.75}]}], files: []};
			repoService.createTree([
				{FullPath:'/tempProjects/hashsha1/dir1/dir2/file1', Score: 0.5},
				{FullPath:'/tempProjects/hashsha1/dir1/file2', Score: 0.75},
				{FullPath:'/tempProjects/hashsha1/dir1/dir2/dir3/file3', Score: 0.25}
									], function (res, err) {	
				assert.deepEqual(res, manyTree);
				done();
			});
		});
	});
});
