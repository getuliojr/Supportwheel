
module.exports = function (config) {
  config.set({
    basePath: '.',

    frameworks: ['jasmine'],

    files: [

      // Third party libs, should be added automatically by grunt: devDependencies
      // bower:js
      'app/libs/es5-shim/es5-shim.js',
      'app/libs/jquery/dist/jquery.js',
      'app/libs/angular/angular.js',
      'app/libs/angular-animate/angular-animate.js',
      'app/libs/angular-loading-bar/build/loading-bar.js',
      'app/libs/angular-resource/angular-resource.js',
      'app/libs/angular-sanitize/angular-sanitize.js',
      'app/libs/angular-messages/angular-messages.js',
      'app/libs/signalr/jquery.signalR.js',
      'app/libs/angular-signalr-hub/signalr-hub.js',
      'app/libs/angular-ui-router/release/angular-ui-router.js',
      'app/libs/json3/lib/json3.js',
      'app/libs/lodash/lodash.js',
      'app/libs/toastr/toastr.js',
      'app/libs/ngstorage/ngStorage.js',
      'app/libs/angular-jwt/dist/angular-jwt.js',
      'app/libs/angular-translate/angular-translate.js',
      'app/libs/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'app/libs/angular-aria/angular-aria.js',
      'app/libs/angular-material/angular-material.js',
      'app/libs/angular-material-data-table/dist/md-data-table.js',
      'app/libs/angular-filter/dist/angular-filter.js',
      'app/libs/angular-mocks/angular-mocks.js',
      // endbower

      // nossa aplicação e testes
      'app/*.js',
      'app/components/**/*.js',
      'app/shared/**/*.js',

      // templates
      'app/components/**/*.{html, htm}'

    ],
    // lista de arquivos para excluir
    exclude: [
      'app/components/wheel/*.js',
    ],

    autoWatch: true,
    singleRun: false,
    colors: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    // If browser does not capture in given timeout [ms], kill it
    //captureTimeout: 8000,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_ERROR,

    reporters: ['dots'],

    preprocessors: {
        //Converter os templates em modulos para os testes
        'app/components/**/*.{htm,html}': ['ng-html2js']
    },


    //Configuration to generate an html report for the unit tests
    htmlReporter: {
        outputDir: 'docs/tests/', // where to put the reports 
        templatePath: null, // set if you moved jasmine_template.html
        focusOnFailures: true, // reports show failures on start
        namedFiles: false, // name files instead of creating sub-directories
        pageTitle: "Unit Tests", // page title for reports; browser info by default
        urlFriendlyName: true, // simply replaces spaces with _ for files/dirs
        reportName: 'unit', // report summary filename; browser info by default


        // experimental
        preserveDescribeNesting: true, // folded suites stay folded 
        foldAll: false, // reports start folded (only with preserveDescribeNesting)
    },

    //Configure templates so it can be used in the tests
    ngHtml2JsPreprocessor: {
        // setting this option will create only a single module that contains templates
        // from all the files, so you can load them all with module('templates')
        moduleName: 'templates'


      // strip this from the file path
      //stripPrefix: 'frontend/',
      // prepend this to the
      //prependPrefix: ''

      // or define a custom transform function
      //, cacheIdFromPath: function (filepath) {
      //    return filepath;
      //}

      
    }
  });
};
