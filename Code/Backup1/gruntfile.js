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
                files:{
                    "app/locales/en.json": ["app/components/**/en.json", "app/shared/locales/en.json"],
                    "app/locales/pt.json": ["app/components/**/pt.json", "app/shared/locales/pt.json"],
                    "app/locales/fr.json":["app/components/**/fr.json", "app/shared/locales/fr.json"],
                    "app/locales/es.json":["app/components/**/es.json", "app/shared/locales/es.json"]
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
                title: "ASAMap Documentation",
                titleLink: "/asamap/docs/index.html",
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
            unitHtml:{
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

        //Responsável em fazer o build da solução em .NET
        //msbuild: {
        //    dev: {
        //        src: ['ASAMap.csproj'],
        //        options: {
        //            projectConfiguration: 'Debug',
        //            targets: ['Clean', 'Rebuild'],
        //            stdout: true,
        //            version: 4.0,
        //            maxCpuCount: 4,
        //            buildParameters: {
        //                WarningLevel: 2
        //            },
        //            verbosity: 'quiet'
        //        }
        //    }
        //},

        //Configura e abre o IIS Express 8 para rodar a aplicação
        //iisexpress: {
        //    server: {
        //        options: {
        //            port: 44500,
        //            open: true,
        //            killOn: 'iis.done'
        //        }
        //    }
        //},



        // Watches files for changes and runs tasks based on the changed files
        //watch: {
        //    serverCSFiles: {
        //        files: ['./**/*.cs'],
        //        tasks: ['msbuild']
        //    },
        //    serverASPFiles: {
        //        files: ['./**/*.aspx', './**/*.master'],
        //        options: {
        //            livereload: true
        //        }
        //    },
        //    clientViews: {
        //        files: ['/app/modules/{,*/}/views/*.{htm,html}'],
        //        options: {
        //            livereload: true
        //        }
        //    },
        //    clientJS: {
        //        files: ['/app/*.js', '/app/directives/{,*/}*.js',
        //                '/app/filters/{,*/}*.js',
        //                '/app/modules/**/*.js',
        //                '!app/modules/**/*.spec.js'],
        //        tasks: ['newer:jshint:client'],
        //        options: {
        //            livereload: true
        //        }
        //    },
        //    clientCSS: {
        //        files: ['/content/styles/{,*/}*.css'],
        //        tasks: ['csslint'],
        //        options: {
        //            livereload: true
        //        }
        //    },
        //    clientTest: {
        //        files: ['/app/modules/{,*/}/tests/{,*/}*.spec.js'],
        //        tasks: ['newer:jshint:test', 'karma:unit']

        //    },
        //    e2eTests: {
        //        files: ['/app/modules/{,*/}/tests/{,*/}*.e2e.js'],
        //        tasks: ['protractor:singlerun']
        //    },
        //    bower: {
        //        files: ['../bower.json'],
        //        tasks: ['wiredep']
        //    }
        //},

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            frontend: {
                options: {
                    open: true,
                    directory: '.',
                    keepalive: true,
                    livereload: true,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.')
                        ];
                    }
                }
            },
            coverage: {
                options: {
                    // base:        './',
                    open: true,
                    directory: appConfig.test.unit.coverage.path,
                    port: appConfig.test.unit.coverage.port,
                    keepalive: true,
                    livereload: false,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, appConfig.test.unit.coverage.path)
                        ];
                    }
                }
            },
            coverageE2E: {
                options: {
                    port: appConfig.test.e2e.coverage.port,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, appConfig.test.e2e.instrumented.path + 'app')
                        ];
                    },
                    livereload: false,
                    debug: false
                }
            },
            coverageE2EReport: {
                options: {
                    open: true,
                    port: appConfig.test.e2e.report.port,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, appConfig.test.e2e.coverage.path + '/reports')
                        ];
                    },
                    keepalive: true,
                    livereload: false
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
            //Em andamento, falta configurar a parte de build de distribuição (produção)           
            //            dist: {
            //                /* Configure a single source file */
            //            options:{
            //                removeBlock: true
            //            },
            //                src: './app/index.html',
            //                blocks: {'app': { src: 'dist/ngBug.js'}}
            //            },
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

        // Add vendor prefixed styles to the css (Para o build final)
        //        autoprefixer: {
        //            options: {
        //                browsers: ['last 1 version']
        //            },
        //            dist: {
        //                files: [{
        //                    expand: true,
        //                    cwd: '.tmp/assets/styles/',
        //                    src: '{,*/}*.css',
        //                    dest: '.tmp/assets/styles/'
        //                }]
        //            }
        //        },

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

        // Renames files for browser caching purposes
        //        filerev: {
        //            dist: {
        //                src: [
        //                    '/app/modules/{,*/}*.js',
        //                    '/app/assets/styles/{,*/}*.css',
        //                    '/app/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
        //                    '/app/assets/fonts/*'
        //                ]
        //            }
        //        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        //        useminPrepare: {
        //            html: '/app/index.html',
        //            options: {
        //                dest: 'app',
        //                flow: {
        //                    html: {
        //                        steps: {
        //                            js: ['concat', 'uglifyjs'],
        //                            css: ['cssmin']
        //                        },
        //                        post: {}
        //                    }
        //                }
        //            }
        //        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        //        usemin: {
        //            html: ['/app/{,*/}*.html'],
        //            css: ['/app/assets/styles/{,*/}*.css'],
        //            options: {
        //                assetsDirs: ['app','/app/assets/images']
        //            }
        //        },


        //        imagemin: {
        //            dist: {
        //                files: [{
        //                    expand: true,
        //                    cwd: '/app/assets/images',
        //                    src: '{,*/}*.{png,jpg,jpeg,gif}',
        //                    dest: '/app/assets/images'
        //                }]
        //            }
        //        },
        //
        //        svgmin: {
        //            dist: {
        //                files: [{
        //                    expand: true,
        //                    cwd: '/app/assets/images',
        //                    src: '{,*/}*.svg',
        //                    dest: '/app/assets/images'
        //                }]
        //            }
        //        },
        //
        //        htmlmin: {
        //            dist: {
        //                options: {
        //                    collapseWhitespace: true,
        //                    conservativeCollapse: true,
        //                    collapseBooleanAttributes: true,
        //                    removeCommentsFromCDATA: true,
        //                    removeOptionalTags: true
        //                },
        //                files: [{
        //                    expand: true,
        //                    cwd: 'app',
        //                    src: ['*.html', 'modules/{,*/}/views/*.{htm,html}'],
        //                    dest: 'app'
        //                }]
        //            }
        //        },

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        //        ngAnnotate: {
        //            dist: {
        //                files: [{
        //                    expand: true,
        //                    cwd: '.tmp/concat/modules',
        //                    src: ['*.js', '!oldieshim.js'],
        //                    dest: '.tmp/concat/modules'
        //                }]
        //            }
        //        },

        // Replace Google CDN references
        //        cdnify: {
        //            dist: {
        //                html: ['/app/*.html']
        //            }
        //        },

        // Copies remaining files to places other tasks can use
        copy: {
            //            dist: {
            //                files: [{
            //                    expand: true,
            //                    dot: true,
            //                    cwd: 'app',
            //                    dest: 'app',
            //                    src: [
            //                        '*.{ico,png,txt}',
            //                        '.htaccess',
            //                        '*.html',
            //                        'modules/{,*/}/views/*.{htm,html}',
            //                        'assets/images/{,*/}*.{webp}',
            //                        'assets/fonts/*'
            //                    ]
            //                }, {
            //                    expand: true,
            //                    cwd: '.tmp/assets/images',
            //                    dest: '/app/assets/images',
            //                    src: ['generated/*']
            //                }, {
            //                    expand: true,
            //                    cwd: '.',
            //                    src: '/app/libs/bootstrap-sass-official/assets/fonts/bootstrap/*',
            //                    dest: 'app'
            //                }]
            //            },
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
        },

        // Run some tasks in parallel to speed up the build process
        //concurrent: {
        //    server: {
        //        tasks: ['iisexpress', 'watch'],
        //        options: {
        //            logConcurrentOutput: true
        //        }
        //    },
        //    e2e: {
        //        tasks: ['connect:frontend', 'watch'],
        //        options: {
        //            logConcurrentOutput: true,
        //            limit: 5
        //        }
        //    },
        //    options: {
        //        logConcurrentOutput: true
        //    }
        //},


        

        //Responsavel por iniciar o servidor
        //protractor_webdriver: {
        //    keepAlive: {
        //        options: {
        //            keepAlive: true
        //        }
        //    },
        //    singleRun: {
        //        options: {
        //            keepAlive: false
        //        }
        //    }

        //},

        //Configurações para rodar o protractor
        //protractor: {
        //    options: {
        //        configFile: '/app/protractor.conf.js'
        //    },
        //    singlerun: {
        //        keepAlive: false //Para em caso de erro
        //    },
        //    auto: {
        //        keepAlive: true //Continua rodando em caso de erro
        //    },
        //    debug: {
        //        keepAlive: true,
        //        debug: true
        //    }
        //},
        //'protractor_coverage': {
        //    local: {
        //        options: {
        //            configFile: '/app/protractor.conf.js',
        //            keepAlive: true,
        //            noColor: false,
        //            coverageDir: appConfig.test.e2e.instrumented.path + 'app',
        //            baseUrl: 'http://localhost:7776'
        //        }
        //    }
        //},
        //'instrument': {
        //    options: {
        //        lazy: true,
        //        basePath: appConfig.test.e2e.instrumented.path
        //    },
        //    files: [

        //        '/app/App.js',
        //        '/app/directives/{,*/}*.js',
        //        '/app/filters/{,*/}*.js',
        //        '/app/modules/{,*/}*.js',
        //        '/app/modules/{,*/}/controllers/*.js',
        //        '/app/modules/{,*/}/services/*.js'
        //    ]
        //},
        //'makeReport': {
        //    src: appConfig.test.e2e.instrumented.path + '/app/*.json',
        //    options: {
        //        type: 'html',
        //        dir: appConfig.test.e2e.coverage.path + 'reports',
        //        print: 'detail'
        //    }
        //},
        //notify: {
        //    msbuild: {
        //        options: {
        //            message: 'Build concluído com sucesso.'
        //        }
        //    }
        //}
    });

    //    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    //        if (target === 'dist') {
    //            return grunt.task.run(['build', 'connect:dist:keepalive']);
    //        }
    //
    //        grunt.task.run([
    //            'clean:server',
    //            'wiredep',
    //            'fileblocks:dev',
    //            'autoprefixer',
    //            'connect:livereload',
    //            'watch'
    //        ]);
    //    });

    //    grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    //        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    //        grunt.task.run(['serve:' + target]);
    //    });

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

