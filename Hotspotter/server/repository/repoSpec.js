


var Repo = require('./repoModel');
module.exports.create = function () {
	// 
	var test1 = new Repo({
		url: 'url1',
		name: 'name1'
	})

		//
	var test2 = new Repo({
		url: 'url2',
		name: 'name2'
	})

	//
	test1.save(function (err, data) {
		if (err) console.log(err);
		else console.log('Saved : ', test1, '\n');
	})

	//
	test2.save(function (err, data) {
		if (err) console.log(err);
		else console.log('Saved : ', test2, '\n');
	})
	
}

module.exports.find = function () {
	Repo.find(function(err, tests) {
		console.log(tests);
	})
}

module.exports.clear = function () {
	// Clean database 
	Repo.remove({}, function(err) {
		console.log('\nCleared database... \n');
	});
}

