'use strict';

module.exports = function (config) {
  config.set({
    basePath: '.',

    frameworks: ['jasmine'],

    files: [
      // libs 3rd PArty Code
      'app/libs/angular/angular.js',
      'app/libs/angular-mocks/angular-mocks.js',
      'app/libs/angular-animate/angular-animate.js',
      'app/libs/angular-resource/angular-resource.js',
      'app/libs/angular-loading-bar/build/loading-bar.js',
      'app/libs/jquery/dist/jquery.js',
      'app/libs/lodash/lodash.js',
      'app/libs/angular-ui-router/release/angular-ui-router.js',
      'app/libs/toastr/toastr.js',
      'app/libs/ngstorage/ngStorage.js',
      'app/libs/angular-material/angular-material.js',
      'app/libs/angular-aria/angular-aria.js',


      // nossa aplicação e testes
      'app/*.js',
      'app/directives/{,*/}*.js',
      'app/filters/{,*/}*.js',
      'app/modules/**/*.js',

      // templates
      //'app/directives/**/*.{htm, html}',
      //'app/filters/**/*.{htm, html}',
      'app/modules/**/views/*.{html, htm}',


    ],
    // lista de arquivos para excluir
    exclude: [

    ],

    autoWatch: false,
    singleRun: true,
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
    logLevel: config.LOG_INFO,

    reporters: ['dots'],

    preprocessors: {
        //Converter os templates em modulos para os testes
        'modules/**/views/*.{htm,html}': ['ng-html2js']
    }
//    //Caso seja necessário personalizar algo na configuração de html para módulos JS
//    ,ngHtml2JsPreprocessor: {
//      // strip this from the file path
//      //stripPrefix: 'frontend/',
//      // prepend this to the
//      //prependPrefix: ''
//
//      // or define a custom transform function
//      //,cacheIdFromPath: function(filepath) {
//      //    return cacheId;
//      //}
//
//      // setting this option will create only a single module that contains templates
//      // from all the files, so you can load them all with module('foo')
//      //,moduleName: 'templates'
//    }
  });
};
