'use strict';

var webpack = require('webpack');
var projectsInfo = require('./lib/projectsInfo.js');

module.exports = function (webPackProdConfig) {

  // Add source mapping for debuging.
  webPackProdConfig.devtool = 'source-map';

  // plugins for development
  webPackProdConfig.plugins = webPackProdConfig.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.BROWSER': JSON.stringify(true),
    })
  ]);
  webPackProdConfig.output.publicPath = projectsInfo.options.assets.dev;
  return webPackProdConfig;
};
