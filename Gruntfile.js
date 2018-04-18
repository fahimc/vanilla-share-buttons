'use strict';
var fs = require("fs");

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

  grunt.initConfig({
    clean: {
      options: {
        force: true
      },
      dist: ['dist/**', 'release/**']
    },
    copy: {
      src: {
        expand: true,
        cwd: 'src/',
        src: ['**/*', '!js/**', '!style/**'],
        dest: 'dist/'
      },
      resource: {
        expand: true,
        cwd: 'src',
        src: ['resource/**/*'],
        dest: 'dist/'
      },
      release: {
        expand: true,
        cwd: 'dist/js',
        src: ['share.js'],
        dest: 'release/'
      }
    },
    cssmin: {
      options: {
        mergeIntoShorthands: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'dist/css/main.min.css': ['dist/css/main.css']
        }
      }
    },
    browserify: {
      dist: {
        options: {
          transform: [
            ["babelify", {
              sourceMap: true,
              sourceType: 'module',
              "presets": ["es2015"]
            }]
          ]
        },
        files: {
          'dist/js/share.js': ['src/js/main.js']
        }
      }
    },
    sass: {
      options: {
        sourceMap: true
      },
      src: {
        files: {
          'dist/css/main.css': 'src/style/import.scss'
        }
      }
    },
    connect: {
      server: {
        options: {
          open: 'http://localhost:9001',
          hostname: '127.0.0.1',
          livereload: true,
          port: 9001,
          base: {
            path: 'dist',
            options: {
              index: 'index.html'
            }

          }
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      js: {
        files: ['src/**/*.js'],
        tasks: ['dist', 'copy-css-to-js']

      },
      sass: {
        files: ['src/**/*.scss'],
        tasks: ['sass', 'copy-css-to-js']

      },
      html: {
        files: ['src/**/*.html'],
        tasks: ['copy:src', 'copy-css-to-js']

      }
    }
  });

  function updateJS(isRelease) {
    var jsPath = isRelease ? "/release/share.js" : "/dist/js/share.js";
    var cssContent = fs.readFileSync(__dirname + "/dist/css/main.css", "utf8");
    var jsContent = fs.readFileSync(__dirname + jsPath, "utf8");
    cssContent = cssContent.replace(/\s/g, "\\n");
    cssContent = cssContent.replace(/['"]+/g, '\"');
    jsContent = jsContent.replace('{style}', cssContent);
    fs.writeFileSync(__dirname + jsPath, jsContent);
  }
  grunt.registerTask('copy-css-to-js', '', function() {
    updateJS();
  });

  grunt.registerTask('copy-css-to-js-release', '', function() {
    updateJS(true);
  });

  grunt.registerTask('dist', ['clean:dist', 'copy:resource', 'sass','cssmin', 'copy:src', 'browserify']);
  grunt.registerTask('default', ['dist', 'copy-css-to-js', 'connect', 'watch']);
  grunt.registerTask('release', ['dist', 'copy:release', 'copy-css-to-js-release']);


};
