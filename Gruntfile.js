'use strict';

var libs = ['bootstrap', 'vue', 'bootbox', 'lodash', 'vuex', 'vue-resource', 'vue-router', 'jquery', 'moment', 'epic-spinners/dist/lib/epic-spinners.min.js'];

module.exports = function(grunt) {
    var tasks = {
        browserify: {
            ui: {
                files: {
					'build/ui/js/login.js': ['src/ui/js/login.js'],
					'build/ui/js/signup.js': ['src/ui/js/signup.js'],
					'build/ui/js/dashboard.js': ['src/ui/js/dashboard.js'],
                },
                options: {
                    transform: ['vueify']
                }
            },
            docs: {
                files: {
                    'build/docs/js/script.js': ['src/docs/js/script.js'],
                },
                options: {
                    external: null
                }
            },
            vendor: {
                src: [],
                dest: 'build/ui/js/vendor.js',
                options: {
                    external: null,
                    require: libs
                },
            },
            options: {
                external: libs
            },
        },

        copy: {
            server: {
                files: [{
                        expand: true,
                        cwd: 'src/server',
                        src: ['**/*'],
                        dest: 'build/server/'
                    },
                    // {
                    // 	expand: true,
                    // 	cwd: 'src/server/bin',
                    // 	src: ['*'],
                    // 	dest: 'build/server/bin/'
                    // },
                    // {
                    // 	expand: true,
                    // 	cwd: 'src/server/database',
                    // 	src: ['*'],
                    // 	dest: 'build/server/database/'
                    // },
                    // {
                    // 	expand: true,
                    // 	cwd: 'src/server/routes',
                    // 	src: ['*'],
                    // 	dest: 'build/server/routes/'
                    // }
                ]
            },
            ui: {
                files: [
					{
                        expand: true,
                        cwd: 'src/ui/img',
                        src: ['**/*'],
                        dest: 'build/ui/img/'
                    },
                    {
                        expand: true,
                        cwd: 'src/ui',
                        src: ['*.html'],
                        dest: 'build/ui'
                    },
                ]
            },

            docs: {
                files: [{
                    expand: true,
                    cwd: 'src/docs/',
                    src: ['**/*', '!**/*.js'],
                    dest: 'build/docs/',
                    extDot: 'first'
                }, ]
            }
        },
        //clean the build folder
        clean: {
            all: 'build',
            client: 'build/client',
            server: 'build/server',
            docs: 'build/docs'
        },
        less: {
            docs: {
                files: {
                    'build/docs/css/docs.css': 'src/docs/css/docs.less'
                }
            },
            vendor: {
                files: {
                    'build/ui/style/vendor.css': 'src/ui/style/vendor.less'
                }
            }
        },
        eslint: {
            gruntfile: 'Gruntfile.js',
            server: ['src/server/**/*.js', '!src/server/server-tftp/**/*.js'],
            ui: ['src/ui/**/*.js', 'src/ui/**/*.vue']
        }
    };

    grunt.initConfig(tasks);
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-eslint');

    grunt.registerTask('server', ['eslint:server', 'copy:server']);

    grunt.registerTask('ui', ['eslint:ui', 'browserify', 'less', 'copy:ui']);

    grunt.registerTask('docs', ['browserify:docs', 'copy:docs', 'less:docs']);
    grunt.registerTask('fastui', ['eslint:ui', 'browserify:ui']);

    grunt.registerTask('default', ['server', 'ui', 'docs']);
};