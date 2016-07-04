var projectsInfo = require('./projectsInfo.js');
var initPromptConfig = require('./initPromptConfig.js');
var webPackBaseObject = require('./webPackBaseConfig.js');
var _ = require('lodash');
var initBuild = function (grunt) {

  /**
   * grunt-prompt task
   * demo:https://github.com/xg0409/grunt-prompt-demo
   */
  grunt.registerTask('prod-build', 'production build task', function () {
    var prodBuild = {
      options: {
        questions: initPromptConfig.questions,
        then: function (results, done) {
          console.log("prompt_results", results);
          var project_item = results.project_item;
          var submodule_item = results.submodule_item;
          var build_all_judge = results.build_all_judge == 'yes' ? true : false;
          if (submodule_item == "build_all_submodules" && !build_all_judge) {
            console.log("放弃编译所有模块");
            return;
          }
          var webPackBaseConfig = webPackBaseObject(build_all_judge, project_item, submodule_item);
          var webPackProdConfig = require('../webpack.prod.config.js')(webPackBaseConfig);
          console.log("process.env.NODE_ENV",process.env.NODE_ENV)
          var webpack = {
            options: webPackProdConfig,
            "prod-build": {}
          };
          grunt.config.set('webpack', webpack);
          grunt.task.run(['webpack:prod-build']);
        }
      }
    }
    grunt.config.set('prompt', {
      build: prodBuild
    });
    grunt.task.run(['prompt:build']);
  });


  grunt.registerTask('dev-build', 'develop build task', function () {
    var devBuild = {
      options: {
        questions: initPromptConfig.questions,
        then: function (results, done) {
          console.log("prompt_results", results);
          var project_item = results.project_item;
          var submodule_item = results.submodule_item;
          var build_all_judge = results.build_all_judge == 'yes' ? true : false;
          if (submodule_item == "build_all_submodules" && !build_all_judge) {
            console.log("放弃编译所有模块");
            return;
          }
          var webPackBaseConfig = webPackBaseObject(build_all_judge, project_item, submodule_item);
          var webPackDevConfig = require('../webpack.dev.config.js')(webPackBaseConfig);
          var webpack = {
            options: webPackDevConfig,
            "dev-build": {
              // devtool: "sourcemap",
              debug: true
            }
          };
          grunt.config.set('webpack', webpack);
          grunt.task.run(['webpack:dev-build']);
        }
      }
    };

    grunt.config.set('prompt', {
      build: devBuild
    });
    grunt.task.run(['prompt:build']);
  });


  grunt.registerTask('hot', 'hot build task', function () {
    var devBuild = {
      options: {
        questions: initPromptConfig.questions,
        then: function (results, done) {
          console.log("prompt_results", results);
          var project_item = results.project_item;
          var submodule_item = results.submodule_item;
          var build_all_judge = results.build_all_judge == 'yes' ? true : false;
          if (submodule_item == "build_all_submodules" && !build_all_judge) {
            console.log("放弃编译所有模块");
            return;
          }
          var webPackBaseConfig = webPackBaseObject(build_all_judge, project_item, submodule_item);
          var webPackDevConfig = require('../webpack.hot.config.js')(webPackBaseConfig);

          var webpackDevServerHot = {
            options: {
              webpack: webPackDevConfig,
              publicPath: webPackDevConfig.output.publicPath,
              // 基于项目目录静态资源路径
              contentBase: webPackDevConfig.devServer.contentBase
            },
            start: {
              keepAlive: true,
              hot: true,
              historyApiFallback: true,
              host: projectsInfo.options.devServer.host,
              port: projectsInfo.options.devServer.port,
              webpack: {
                devtool: "eval",
                debug: true
              }
            }
          };
          grunt.config.set('webpack-dev-server', webpackDevServerHot);
          grunt.task.run(['webpack-dev-server:start']);
        }
      }
    };

    grunt.config.set('prompt', {
      build: devBuild
    });
    grunt.task.run(['prompt:build']);
  });


  grunt.registerTask('test-build', 'production build task', function () {
    var webPackBaseConfig = webPackBaseObject(false, "activities", "activities1");
    var webPackProdConfig = require('../webpack.prod.config.js')(webPackBaseConfig);
    var webpack = {
      options: webPackProdConfig,
      "build-dev": {
        devtool: "sourcemap",
        debug: true
      }
    };
    grunt.config.set('webpack', webpack);
    grunt.task.run(['webpack:build-dev']);
  });


}


module.exports = {
  initBuild: initBuild
};
