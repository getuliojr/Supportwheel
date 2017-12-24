/// <binding BeforeBuild='devDependencies' />

'use strict';

var fs = require('fs'),
    path = require('path'),
    appPrefix = '/';


var mountFolder = function (connect, dir) {
    'use strict';
    return connect.static(path.resolve(dir));
};



// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths for the application
    var appConfig = {
        app: 'app',
        dist: 'dist',
        bowerComponents: './app/libs',
        test: {
            unit: {
                'port': "9090",
                'path': "../.tmp/test",
                'coverage': {
                    'port': "5555",
                    'path': ".tmp/test/coverage/unit/"
                }
                , 'conf': "./karma.conf.js"
            },
            'e2e': {
                'seleniumPort': "4444",
                'path': ".tmp/test",
                'conf': "./app/protractor.conf.js",
                'coverage': {
                    'port': "7776",
                    'path': ".tmp/test/coverage/e2e/"
                },
                'report': {
                    'port': "7777"
                },
                'instrumented': {
                    "path": ".tmp/test/coverage/e2e/instrumented/"
                }
            }
        }

    };

    // Define the configuration for all the tasks
    grunt.initConfig({

      // Project settings
      yeoman: appConfig,

      //Responsable to merge all localizations files in one file for language
      "merge-json": {
        "i18n": {
          files: {
            "app/locales/en.json": ["app/components/**/en.json", "app/shared/locales/en.json"],
            "app/locales/pt.json": ["app/components/**/pt.json", "app/shared/locales/pt.json"],
            "app/locales/fr.json": ["app/components/**/fr.json", "app/shared/locales/fr.json"],
            "app/locales/es.json": ["app/components/**/es.json", "app/shared/locales/es.json"]
          }
        }
      },

      //Responsable to generate the documentation
      ngdocs: {
        options: {
          scripts: [
            // no jquery automatically loaded for tutorial!!!
            '//ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.js',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-touch.js',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-animate.js'
          ],
          dest: 'docs',
          html5Mode: false,
          startPage: '/api',
          title: "Documentation",
          titleLink: "/docs/index.html",
          bestMatch: true
        },
        api: {
          src: ['app/SupportWheel.js', 'app/components/**/*.js', '!app/components/**/*.spec.js', 'app/shared/**/*.js', '!app/shared/**/*.spec.js'],
          title: 'API'
        },
        sourceCode: {
          src: ['content/docs/code/code.js'],
          title: 'Source Code'
        },
        tests: {
          src: ['content/docs/tests/*.js'],
          title: 'Tests'
        }
      },

      //Responsable to add the source code as part of the documentation
      docco: {
        code: {
          src: ['app/SupportWheel.js', 'app/components/**/*.js', '!app/components/**/*.spec.js', 'app/shared/**/*.js', '!app/shared/**/*.spec.js'],
          options: {
            output: 'docs/code'
          }
        }
      },

      //Karma configuration for Angular Unit Tests
      karma: {
        unit: {
          configFile: 'karma.conf.js',
          autoWatch: false,
          singleRun: true
        },
        unitHtml: {
          configFile: 'karma.conf.js',
          autoWatch: false,
          singleRun: true,
          reporters: ['html']
        },
        unitCoverage: {
          configFile: 'karma.conf.js',
          autoWatch: false,
          singleRun: true,
          reporters: ['progress', 'coverage'],
          preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'app/SupportWheel.js': ['coverage'],
            'app/components/**/!(*.spec).js': ['coverage'],
            'app/shared/**/!(*.spec).js': ['coverage'],
            //Views
            'app/components/**/*.{htm,html}': ['ng-html2js']
          },
          coverageReporter: {
            reporters: [
              { type: 'text', dir: 'docs/tests/unit/coverage', subdir: '.' },
              { type: 'html', dir: 'docs/tests/unit/coverage', subdir: '.' }
            ]
          }
        }
      },


      // Controle de Qualidade para o código em Javascript
      jshint: {
        options: {
          jshintrc: '.jshintrc',
          reporter: require('jshint-stylish')
        },
        client: {
          src: [
            '/gruntfile.js',
            '/app/*.js',
            '/app/components/**/*.js',
            '/app/shared/**/*.js',
            '/app/modules/**/*.js'
          ]
        },
        test: {
          options: {
            jshintrc: '.jshintrcForTests'
          },
          src: ['/app/modules/{,*/}/tests/{,*/}*.spec.js']
        }
      },

      //Controle de qualidade para o código em CSS
      csslint: {
        options: {
          csslintrc: '.csslintrc'
        },
        src: ['/content/styles/{,*/}*.css']
      },

      //Responsável por inserir as referencias no index.html
      fileblocks: {
        options: {
          removeFiles: true,
          prefix: appPrefix
        },

        dist: {
          /* Configure a single source file */
          src: './app/index.html',
          blocks: {
            'clientJS': {
              src: './app/dist/app.min.js'
            }
          }
        },

        dev: {
          /* or multiple source files per target. */
          files: [
            {
              src: './app/index.html',
              blocks: {
                'clientJS': { //cwd: 'app',
                  src: [
                    './app/*.js',
                    './app/components/**/*.js',
                    './app/shared/**/*.js',
                    '!./app/components/**/*.spec.js',
                    '!./app/shared/**/*.spec.js'
                  ]
                },
                'clientCSS': {
                  src: ['./content/styles/{,*/}*.css']
                },
                'oldieshim': {
                  src: ['./app/libs/es5-shim/es5-shim.js',
                    './app/libs/json3/lib/json3.js']
                }
              }
            }
          ]
        }
      },

      // Empties folders to start fresh
      clean: {
        dist: {
          files: [{
            dot: true,
            src: [
              '.tmp',
              '/app/{,*/}*',
              '!app/.git*'
            ]
          }]
        },
        coverageE2E: {
          files: [{
            dot: true,
            src: [appConfig.test.e2e.coverage.path]
          }]
        },
        server: '.tmp'
      },


      // Automatically inject Bower components into index.html
      wiredep: {
        app: {
          directory: './app/libs',
          src: 'app/index.html',
          //ignorePath: /\.\.\//,
          fileTypes: {
            html: {
              block: /(([ \t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
              detect: {
                js: /<script.*src=['"]([^'"]+)/gi,
                css: /<link.*href=['"]([^'"]+)/gi
              },
              replace: {
                js: '<script src="' + appPrefix + 'app/{{filePath}}"></script>',
                css: '<link rel="stylesheet" href="' + appPrefix + 'app/{{filePath}}" />'
              }
            }
          }
        },
        karma: {
          devDependencies: true,
          directory: './app/libs',
          src: 'karma.conf.js',
          ignorePath: /\.\.\//,
          fileTypes: {
            js: {
              block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
              detect: {
                js: /'(.*\.js)'/gi
              },
              replace: {
                js: '\'{{filePath}}\','
              }
            }
          }
        }
      },



      concat: {
        generated: {
          files: [
            {
              dest: '.tmp/concat/js/app.js',
              src: [
                'app/components/**/*.js',
                'app/shared/**.*.js',
                'app/app.js'
              ]
            }, {
              dest: '.tmp/concat/libs/libs.js',
              src: [
                'app/libs/**/*.js'
              ]
            }
          ]
        }
      },

      uglify: {
        generated: {
          files: {
            'app/dist/app.min.js': ['.tmp/concat/dist/app.js']
          }
        }
      },

      useminPrepare: {
        html: 'app/index.html',
        options: {
          dest: 'app/build'
        }
      },

      babel: {
        options: {
          presets: ['env']
        },
        dist: {
          files: {
            '.tmp/concat/dist/app.js': '.tmp/concat/js/app.js'
          }
        }
      },


      // Copies remaining files to places other tasks can use
      copy: {
        dist: {
          files: [{
            expand: true,
            dot: true,
            cwd: 'app',
            dest: 'build',
            src: [
              '*.{ico,png,txt}',
              '.htaccess',
              '*.html',
              'components/{,*/}/*.{htm,html}',
              '../content/images/{,*/}*.{webp}',
              '../content/fonts/*'
            ]
          }, {
            expand: true,
            cwd: '.tmp/assets/images',
            dest: '/build/content/images',
            src: ['generated/*']
          }, {
            expand: true,
            cwd: '.',
            src: '/app/libs/bootstrap-sass-official/assets/fonts/bootstrap/*',
            dest: 'app'
          }]
        },
        styles: {
          expand: true,
          cwd: '/content/styles',
          dest: '.tmp/assets/styles/',
          src: '{,*/}*.css'
        },
        coverageE2E: {
          files: [{
            expand: true,
            dot: true,
            cwd: 'app',
            dest: appConfig.test.e2e.instrumented.path + 'app',
            src: [
              'libs/**',
              'index.html'
            ]
          }]
        }
      }
    });

    grunt.registerTask('build', [
      'useminPrepare',
      'concat:generated',
      'babel',
      'uglify:generated',
      'fileblocks:dist'
    ]);


    //To force a run
    grunt.registerTask('forceOn', 'turns the --force option ON',
    function () {
        if (!grunt.option('force')) {
            grunt.config.set('forceStatus', true);
            grunt.option('force', true);
        }
    });
    //to not force a run
    grunt.registerTask('forceOff', 'turns the --force option Off',
      function () {
          if (grunt.config.get('forceStatus')) {
              grunt.option('force', false);
          }
      });

    //Generate all documentation for the app
    grunt.registerTask('docs', [            
        'ngdocs',                                //Generate documentation in the front-end
        'docco',                                //Add source code as part of the documentation
        'karma:unitHtml',                       //Generate Unit Tests in Html 
        'karma:unitCoverage'                   //Generate Coverage for the Unit Tests in Html 
        
    ]);

    grunt.registerTask('devDependencies', [
        
        'fileblocks:dev',                       //inject application dependencies
        
        'wiredep',                              //inject bower dependencies
        
        'merge-json:i18n'                      //merge all locales files in one per language

    ]);

    //Configuração padrão para
    grunt.registerTask('default', [
        'devDependencies'
        //'msbuild',
        //'notify:msbuild',
        //'iisexpress',
        //'watch'
    ]);

    //Roda as tarefas de qualidade de código
    grunt.registerTask('lint', ['jshint', 'csslint']);


    grunt.registerTask('iisexpress-kill', function () {
        grunt.event.emit('iis.done');
    });

    /* -- TAREFAS DE TESTE ------------------------------------------------ */

    grunt.registerTask('test', [
        'karma'
    ]);

    //Vai rodar todos os tipos de tests de covertura
    grunt.registerTask('coverage', [
        'fileblocks:dev',
        'wiredep',
        'test:unit-coverage',
        'test:e2e-coverage'
    ]);


    //Roda a tarefa de de teste de cobertura unitario e cria um servidor para exibir as informações
    grunt.registerTask('test:unit-coverage', [
        'test:run-unit-coverage',
        'connect:coverage'
    ]);

    //Roda a tarefa de teste unitário e abre a página, mas não cria um servidor
    grunt.registerTask('test:run-unit-coverage', 'Roda a tarefa de teste unitário e abre a página, mas não cria um servidor', [
        'karma:unitCoverage',
        //'open:coverage'
    ]);

    //Monta um servidor e roda os tests e2e uma vez
    grunt.registerTask('test:e2e', [
        'protractor:singlerun'
    ]);

    //Monta o servidor e mantem os tests e2e rodando e olhando mudanças
    grunt.registerTask('autotest:e2e', [
        'protractor_webdriver:keepAlive',
        'protractor:auto',
        'watch:e2eTests'
    ]);

    //Sobe um servidor Selenium
    grunt.registerTask('test:e2e-server', [
        'protractor_webdriver:keepAlive'
    ]);

    //Executa os tests de cobertura de código e2e
    grunt.registerTask('test:e2e-coverage', [
        'protractor_webdriver:singleRun',
        'test:run-e2e-coverage',
        'connect:coverageE2EReport'
    ]);

    //Roda e prepara o ambiente para receber o teste e2e
    grunt.registerTask('test:prepare-e2e-coverage', [
        'clean:coverageE2E',
        'copy:coverageE2E',
        'instrument',
        'connect:coverageE2E'
    ]);

    //Abre o relatório de cobertura de código e2e
    grunt.registerTask('test:e2e-coverageReport', [
        'connect:coverageE2EReport'
    ]);

    //Executa os passos para gerar um relatório de cobertura e2e
    grunt.registerTask('test:run-e2e-coverage', 'Run an e2e test coverage report.', [
        'test:prepare-e2e-coverage',
        'protractor_coverage',
        'makeReport'
    ]);

};

