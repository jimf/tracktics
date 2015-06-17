/* jshint node:true */
'use strict';

var istanbul = require('browserify-istanbul');

module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        frameworks: ['browserify', 'jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'test/**/*.test.js'
        ],

        // list of files to exclude
        exclude: [],

        preprocessors: {
            'test/**/*.js': ['browserify']
        },

        browserify: {
            debug: true,
            transform: [istanbul({
                ignore: ['**/node_modules/**', '**/test/**']
            })]
        },

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit'
        reporters: ['dots', 'coverage'],

        coverageReporter: {
            reporters: [
                { type: 'lcov', subdir: 'phantomjs' },
                { type: 'text-summary' }
            ]
        },

        // web server port
        port: 9876,

        // cli runner port
        runnerPort: 9100,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_{DISABLE,ERROR,WARN,INFO,DEBUG}
        logLevel: config.LOG_INFO,

        // watch files and execute tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
            'PhantomJS'
        ],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};
