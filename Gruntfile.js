module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      js: {
        src: ['public/client/*.js'],
        dest: 'public/dist/client.js'
      },
      lib: {
        src: ['public/lib/jquery.js',
        'public/lib/underscore.js',
        'public/lib/backbone.js',
        'public/lib/handlebars.js'],
        dest: 'public/dist/lib.js'
      },
      css: {
        src: ['public/*.css'],
        dest: 'public/dist/css'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
        //come back to this later?
      },
      js: {
        src: ['public/dist/client.js'],
        dest: 'public/dist/client_minify.js'
      },
      lib: {
        src: ['public/dist/lib.js'],
        dest: 'public/dist/lib_minify.js'
      }
    },

    jshint: {
      files: [ 'Gruntfile.js','public/client/*.js','lib/*.js','test/*.js','server.js','./*.js','app/**/*.js'],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        unused: true,
        funcscope: true,
        maxparams:3,
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
        options: {
          //come back later?
        },
        css: {
          src: ['public/dist/css'],
          dest: 'public/dist/minify.css'
        }
    },

    watch: {
      scripts: {
        files: [
          'Gruntfile.js',
          'public/client/**/*.js',
          'public/lib/**/*.js',
          'views/**/*.ejs',

        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: ['git add .',
        'git commit -m "New production push"',
        'git push azure master'
        ].join('&&')
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'jshint',
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run(['shell']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    'test',
    'build',
    'upload'
  ]);



};
