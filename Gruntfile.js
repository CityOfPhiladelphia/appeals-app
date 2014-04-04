'use strict';
var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 9000;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'lodash'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'build'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            options: {
                nospawn: true,
                livereload: true
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                    '<%= yeoman.app %>/scripts/templates/*.{ejs,mustache,hbs}',
                    'test/spec/**/*.js'
                ]
            },
            test: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.js', 'test/spec/**/*.js'],
                tasks: ['test:true']
            }
        },
        connect: {
            options: {
                port: SERVER_PORT,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            },
            test: {
                path: 'http://localhost:<%= connect.test.options.port %>'
            }
        },
        clean: {
            build: ['build/**/*', '!build/.git', '!build/CNAME'],
            server: '.tmp',
            temp: ['temp/']
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%= connect.test.options.port %>/index.html']
                }
            }
        },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '<%= yeoman.app %>/styles',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: '<%= yeoman.app %>/vendor',
                relativeAssets: true
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    name: 'main',
                    baseUrl: '<%= yeoman.app %>/scripts',
                    mainConfigFile: '<%= yeoman.app %>/scripts/main.js',
                    out: '<%= yeoman.app %>/<%= yeoman.dist %>/scripts/main.js',
                    optimize: 'uglify',
                    paths: {
                        'jquery': [
                            '//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min',
                            '../vendor/jquery/jquery'
                        ],
                        'backbone': [
                            '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min',
                            '../vendor/backbone/backbone'
                        ],
                        'underscore': [
                            '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
                            '../vendor/underscore/underscore'
                        ],
                        'bootstrap': [
                            '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap-wizard/1.0.0/js/bootstrap.min',
                            '../vendor/sass-bootstrap/dist/js/bootstrap'
                        ],
                        'bootstrapSelect': [
                            '//cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.3.5/bootstrap-select.min',
                            '../vendor/bootstrap-select/bootstrap-select'
                        ],
                        'bootstrapDatepicker': [
                            '//cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.3.0/js/bootstrap-datepicker.min',
                            '../vendor/bootstrap-datepicker/js/bootstrap-datepicker'
                        ],
                        'text': [
                            '//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.11/require.min',
                            '../vendor/requirejs-text/text'
                        ],
                        'backbonePageable': [
                            '//cdnjs.cloudflare.com/ajax/libs/backbone-pageable/1.4.5/backbone-pageable.min',
                            '../vendor/backbone-pageable/lib/backbone-pageable'
                        ],
                        'leaflet': [
                            '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.2/leaflet'
                        ],
                        'nprogress': [
                            '//cdnjs.cloudflare.com/ajax/libs/nprogress/0.1.2/nprogress.min',
                            '../vendor/nprogress/nprogress'
                        ]
                    },
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true
                }
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/styles/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%= yeoman.app %>/styles/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'images/{,*/}*.{webp,gif}',
                        'styles/fonts/{,*/}*.*',
                        'vendor/sass-bootstrap/fonts/*.*'
                    ]
                }]
            }
        },
        bower: {
            all: {
                rjsConfig: '<%= yeoman.app %>/scripts/main.js'
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        '/styles/fonts/{,*/}*.*',
                        'vendor/sass-bootstrap/fonts/*.*'
                    ]
                }
            }
        },
        stripmq: {
            options: {
                width: 1000,
                type: 'screen'
            },
            all: {
                files: {
                    '<%= yeoman.app %>/build/styles/main.ie.css': ['<%= yeoman.app %>/build/styles/main.min.css']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-stripmq');

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open:server', 'connect:dist:keepalive']);
        }

        if (target === 'test') {
            return grunt.task.run([
                'clean:server',
                // 'compass:server',
                'connect:test',
                'open:test',
                'watch:livereload'
            ]);
        }

        grunt.task.run([
            'clean:server',
            'compass:server',
            'connect:livereload',
            'open:server',
            'watch'
        ]);
    });

    grunt.registerTask('test', function (isConnected) {
        isConnected = Boolean(isConnected);
        var testTasks = [
                'clean:server',
                'compass',
                'connect:test',
                'mocha',
                'watch:test'
            ];

        if(!isConnected) {
            return grunt.task.run(testTasks);
        } else {
            // already connected so not going to connect again, remove the connect:test task
            testTasks.splice(testTasks.indexOf('connect:test'), 1);
            return grunt.task.run(testTasks);
        }
    });

    grunt.registerTask('build', [
        'clean:build', // Clear the build folder
        'clean:temp', // Clear the temp folder
        // 'compass:dist',
        // 'useminPrepare',
        'requirejs', // Combine JS assets
        'compass', // Compile the SASS files to CSS
        'cssmin',
        'copy',
        'processhtml',
        'clean:temp'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
