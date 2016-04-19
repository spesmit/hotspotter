/**
 * Created by SmithS on 04/02/2016.
 */

var Diff = require('./diffModel')

exports.parseDiff = function(diff_raw, callback) {

	var type = 'change'
	var from
	var to

	var index_from = diff_raw.indexOf('---')
	var index_to = diff_raw.indexOf('+++')

	if (index_to == -1) {
		index_to = diff_raw.length
	}

	var index_rename = diff_raw.indexOf('rename ')

	var index_new = diff_raw.indexOf('new file')

	var index_del = diff_raw.indexOf('delete file')

	var index_cpy = diff_raw.indexOf('copy ')

	var index_file = diff_raw.indexOf('diff --git')

	if (index_file != -1) {
		var end = diff_raw.indexOf('\n', index_file)
		var fileString = diff_raw.substring(index_file, end).replace('diff --git', '').trim()
		files = fileString.split(' ')
		to = files[1].replace('b/', '')
		from = files[0].replace('a/', '')
	}

	if (index_rename != -1 && index_rename < index_to) 
		type = 'rename'

	if (index_new != -1 && index_new < index_to) 
		type = 'new'
	
	if (index_del != -1 && index_del < index_to) 
		type = 'remove'

	if (index_cpy != -1 && index_cpy < index_to)
		type = 'copy'

	if (index_to != -1 && index_from != -1) {
		var to_end = diff_raw.indexOf('\n', index_to)
	
		var lines = diff_raw.substring(to_end).replace(/[\\]+ No newline at end of file/g, '').replace(/(@@ -\d+,\d+ \+\d+,\d+ @@[^\n])/g, '$1\n ').trim()
		var line = lines.split('\n')

		var additions = []
		var deletions = []
		var noChanges = []

		for (var i = 0; i < line.length; i++) {

			var first = line[i].charAt(0);
			if (first == '@') {
				
			} else if (first == '-') {
				deletions.push(line[i].substring(1).trim().length)
			} else if (first == '+') {
				additions.push(line[i].substring(1).trim().length)
			} else if (first == ' ') {
				//noChanges.push(line[i].trim())
			} else if (first == '') {

			} else {
				console.log("Unknown Character: " + line[i])
			}
		}
	} 

	var diff = new Diff({
		Additions : additions,
		Deletions : deletions,
		//NoChanges : noChanges,
		Type : type,
		To : to,
		From : from
	})

	return callback(null, diff)
}

