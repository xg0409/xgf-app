module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  var webpack = require("webpack");
  var webpackConfig = require("./webpack.config.js");
  grunt.initConfig({

    nodemon: {
      server: {
        script: './bin/app.js',
        options: {
          nodeArgs: [ /*'--debug' */ ],
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

  grunt.registerTask('server', ['nodemon:server']);
};
