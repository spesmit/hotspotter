#Project Hotspotter

##Client

 - Dr. Igor Crk
	- icrk@siue.edu
	
	
##Team Members

 - Dylan Williams: Quality Assurance Manager
 - Spencer Smith: Client Proxy
 - Nathan Reinhardt: Scrum Master
 

## Product Description

Software for the detection of frequently modified files and functions from commit logs and source changes of revision-controlled codebases.


##References

 - https://github.com/igrigorik/bugspots
 - http://google-engtools.blogspot.com/2011/12/bug-prediction-at-google.html
 - http://landley.net/writing/git-bisect-howto.html
 - http://macbeth.cs.ucdavis.edu/fse2011.pdf
 
 
###Tech Stack###
 
- AngularJs
- Express
- Nodejs
- MongoDb

###TO RUN###

*Assuming you have node and mongo installed*

https://nodejs.org/en/

https://www.mongodb.org/downloads#production


####Setup####


#####Install Grunt-Cli and bower globally#####

npm install -g bower
npm install -g grunt-cli


Travel to the base directory of this project where you saved it.

These steps will download the required dependencies to run the app.

- 1: run 'npm install' 
- 2: run 'bower install'

####Running####
- 1: run 'grunt dev' in one console
- 2: run 'mongod'  in a new console to start up your mongo database
- Finally: run 'node server' in a new console to start up the application

Now travel to localhost:3000 in your browser