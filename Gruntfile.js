module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  var webpack = require("webpack");
  grunt.initConfig({

    ngtemplates: {
      options: {
        htmlmin: {
          removeComments: true,
          collapseWhitespace: true,
          // Note we must set it as false to avoid angular directive lose boolea expression while compile phase.
          // <div loop="true"></div> will be converted to <div loop></div>
          collapseBooleanAttributes: false
        }
      },
      activities1: {
        options: {
          module: 'activities_activities1',
          prefix: '/'
        },
        cwd: 'projects/activities/activities1/',
        src: '**/*.html',
        dest: 'projects/activities/activities1/views/index.js'
      }
    },
    watch: {
      ngtemplates: {
        files: 'projects/**/*.html',
        tasks: [ 'ngtemplates' ]
      }
    },

    concurrent: {
      target: {
        tasks: ['nodemon:server', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    nodemon: {
      server: {
        script: './bin/app.js',
        options: {
          nodeArgs: [/*'--debug' */],
          ignore: ['node_modules/**'],
          env: {
            PORT: 8090,
            // for development, isomorphic server rendering
            NODE_ENV: '',
            DEBUG: 'projects:*,',
            DEBUG_COLORS: true,
          },
          ext: 'js,jsx,html,ejs',
        }
      }
    }
  });

  require('./compiler')(grunt);

  grunt.registerTask('server', ['concurrent']);
};
