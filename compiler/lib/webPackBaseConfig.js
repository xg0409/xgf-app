var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");
var projectsInfo = require('./projectsInfo.js');
var _ = require('lodash');
var webPackBaseConfig = require('../webpack.base.config');

var webPackBaseObject = function (isAllModules, parentModule, submodule) {

  var entry = webPackBaseConfig.entry;
  var output = webPackBaseConfig.output;
  var module = webPackBaseConfig.module;
  var devServer = webPackBaseConfig.devServer;
  var plugins = webPackBaseConfig.plugins;
  var options = projectsInfo.options;
  var projects = projectsInfo.projects;

  var defaultClientConfig = [
    "webpack-dev-server/client?http://${host}:${port}",
    "webpack/hot/dev-server"
  ];

  _.extend(defaultClientConfig, _.mapValues(defaultClientConfig, function (itemValue) {
    return _.template(itemValue)({
      host: options.devServer.host,
      port: options.devServer.port
    })
  }));

  if (isAllModules) {
    Object.keys(projects[parentModule]).forEach(function (projectName) {
      var clientConfig = _.clone(defaultClientConfig);
      if (projectName == "_metaInfo")return;
      var projectObject = projects[parentModule][projectName];
      clientConfig.push(projectObject.entry);
      entry[projectName] = clientConfig;
    });
  } else {
    var clientConfig = defaultClientConfig;
    clientConfig.push(projects[parentModule][submodule].entry);
    entry[submodule] = clientConfig;
  }

  _.extend(output, {
    publicPath: options.devServer.publicPath
  }, _.mapValues(output, function (itemValue) {
    return _.template(itemValue)({
      moduleName: parentModule
    })
  }));

  _(module.loaders).forEach(function (loaderItem) {
    _.extend(loaderItem, _.mapValues(loaderItem, function (itemVlaue) {
      if (_.isObject(itemVlaue)) {
           _.extend(itemVlaue,_.mapValues(itemVlaue,function(subItemVlaue){
            return _.template(subItemVlaue)({
              moduleName:parentModule,
              projectName:options.projectName
            })
          }));
      }
      return itemVlaue;
    }));
  });


  devServer = {
    //选项指定服务器静态资源的路径
    contentBase: options.projectRoot
  };

  _(plugins).forEach(function(itemObject){
    if(_.isObject(itemObject)){
      _.extend(itemObject, _.mapValues(itemObject, function (itemValue) {
        return _.template(itemValue)({
          moduleName:parentModule
        })
      }));
    }
  });
  
  return {
    entry: entry,
    output: output,
    module:module,
    devServer:devServer,
    plugins:plugins
  }


};


module.exports = webPackBaseObject;