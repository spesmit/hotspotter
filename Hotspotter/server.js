//====================================Server Dependencies=========================================//
//Tell the server to use express as middle ware
var express = require('express');
//Assigning express to our app
var app = express();
//Telling the server to use body-parser which is needed to parse out json
var  bodyParser = require('body-parser');
//Tell the sever to use mongoose for our domain object mocker
var  mongoose = require('mongoose');
//Allows server to use HTTP verbs such as PUT and DELETE.
var methodOverride = require('method-override');
//==============================================================================================//


//Makes connection to the local mongo database
mongoose.connect('mongodb://localhost:27017/hotspotter');


// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// parse application/x-www-form-urlencodedg
app.use(bodyParser.urlencoded({ extended: true }));
//Use X-HTTP=Method-Override for verbiage
app.use(methodOverride('X-HTTP-Method-Override'));


app.use('/', express.static(__dirname + '/client'));
app.use('/images', express.static(__dirname + '/client/images'));
app.use('/views', express.static(__dirname + '/client/dashboard/dashboard.html'));
app.use("/css", express.static(__dirname + '/client/thirdParty/angular-tree-view/css/style.css'));
app.use("/css/fileView", express.static(__dirname + '/client/fileView/fileView.css'));
app.use("/css/loadingStyle", express.static(__dirname + '/client/common/loadingStyle.css'));
//Point the server at project dependencies brought in from doing a "npm install" and "bower install"
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));


require('./server/routes')(app);
//Server is listening to port 3000
app.listen(3000);
console.log('Im Listening...');


exports = module.exports = app;