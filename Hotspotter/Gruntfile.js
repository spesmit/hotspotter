// Gruntfile.js

// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function(grunt) {
    'use strict';

    var BOWER_DIR = "bower_components",
        CLIENT_DIR ="client",

        EXTERNAL_JS_FILES = [
            BOWER_DIR + "/angular/angular.js",
            BOWER_DIR + "/jquery/dist/jquery.js",
            BOWER_DIR + "/angular-resource/angular-resource.js",
            BOWER_DIR + "/angular-route/angular-route.js",
	        BOWER_DIR + "/angular-tree-view/js/treeView.js",
            BOWER_DIR + "/bootstrap/dist/js/bootstrap.js",
            BOWER_DIR + "/angular-nvd3/dist/angular-nvd3.js",
            BOWER_DIR + "/ng-lodash/build/ng-lodash.js",
            BOWER_DIR + "/d3/d3.js",
            BOWER_DIR + "/nvd3/build/nv.d3.js"


        ],
        INTERNAL_JS_FILES = [
            CLIENT_DIR + "/app.js",
            CLIENT_DIR + "/dashboard/*.js",
            CLIENT_DIR + "/fileView/*.js",
            CLIENT_DIR + "/admin/*.js",
            CLIENT_DIR + "/scoring/*.js",
            CLIENT_DIR + "/thirdParty/angular-tree-view/js/treeView.js",
            "!" + CLIENT_DIR + "/**/*Spec.js"
        ],
	INTERNAL_CSS_FILES = [
	    CLIENT_DIR + "/**/*.css"
	],
	EXTERNAL_CSS_FILES = [
	    BOWER_DIR + "/bootstrap/dist/css/bootstrap.min.css"
	];

    // ===========================================================================
    // CONFIGURE GRUNT ===========================================================
    // ===========================================================================
    grunt.initConfig({

        // get the configuration info from package.json ----------------------------
        // this way we can use things like name and version (pkg.name)
        pkg: grunt.file.readJSON('package.json'),

        // configure jshint to validate js files -----------------------------------
        jshint: {
            options: {
                reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good

            },

            // when this task is run, lint the Gruntfile and all js files in src
            build: ['Gruntfile.js', INTERNAL_JS_FILES]
        },
        concat: {
            internal: {
                src: INTERNAL_JS_FILES,
                dest: 'client/internal.js'
            },
            external: {
                src: EXTERNAL_JS_FILES,
                dest: 'client/third-party.js'
            },
	    internal_css: {
		src: INTERNAL_CSS_FILES,
		dest: 'client/styles.css'
	    },
	    external_css: {
		src: EXTERNAL_CSS_FILES,
		dest: 'client/third-party.css'
	    }
        },
        watch: {
            dev: {
                files: ['Gruntfile.js', INTERNAL_JS_FILES],
                tasks: ['jshint', 'concat', 'simplemocha'],
                options: {
                    atBegin: true
                }
            }
        },
        simplemocha: {
            options: {
                globals: ['expect'],
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'tap'
            },
            all: { src: ['server/**/*Spec.js'] }
        }
    });
    grunt.registerTask('test', ['simplemocha']);
    grunt.registerTask('dev', ['watch']);
    grunt.registerTask('prod',['simplemocha', 'concat']);
    // ===========================================================================
    // LOAD GRUNT PLUGINS ========================================================
    // ===========================================================================
    // we can only load these if they are in our package.json
    // make sure you have run npm install so our app can find these
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-simple-mocha');

};
