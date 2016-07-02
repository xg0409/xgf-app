'use strict';

var webpack = require('webpack');
var projectsInfo = require('./lib/projectsInfo.js');

module.exports = function (webPackProdConfig) {

  // plugins for production
  webPackProdConfig.plugins = webPackProdConfig.plugins.concat([
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.BROWSER': JSON.stringify(true),
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false
    })
  ]);
  webPackProdConfig.output.publicPath = projectsInfo.options.assets.prod;

  return webPackProdConfig;
};
