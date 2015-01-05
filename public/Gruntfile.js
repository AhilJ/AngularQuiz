// Gruntfile.js

// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function(grunt) {

    // ===========================================================================
    // CONFIGURE GRUNT ===========================================================
    // ===========================================================================
    grunt.initConfig({

        // get the configuration info from package.json ----------------------------
        // this way we can use things like name and version (pkg.name)
        pkg: grunt.file.readJSON('package.json'),

      less: {
        build: {
          files: {
            'shared/style.css': 'css/*.less'
          }
        }
      },
      cssmin: {
        options: {
          banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
        },
        build: {
          files: {
            'shared/style.min.css': 'shared/style.css'
          }
        }
      },
      clean: ["shared/shared.concat.js"],
      concat: {
        // JAVASCRIPT
        shared_js: {
          src: [
            'app.js',
            'js/**/*.js'
          ],
          dest: 'shared/shared.concat.js'
        }
      },
      watch: {
        stylesheets: {
          files: ['shared/style.min.css', 'css/*.less'],
          tasks: ['less', 'cssmin']
        },
        scripts: {
          files: ['app.js',
          'js/**/*.js'],
          tasks: ['clean', 'concat', 'concat']
        }
      }
    });

    // ===========================================================================
    // CREATE TASKS ==============================================================
    // ===========================================================================
    grunt.registerTask('default', ['less', 'cssmin', 'clean', 'concat']);

    // ===========================================================================
    // LOAD GRUNT PLUGINS ========================================================
    // ===========================================================================
    // we can only load these if they are in our package.json
    // make sure you have run npm install so our app can find these
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');

};
