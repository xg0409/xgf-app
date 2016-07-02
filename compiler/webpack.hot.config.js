'use strict';

var webpack = require('webpack');

module.exports = function (webPackProdConfig) {

  // Add source mapping for hot server.
  // use sourcemap, convenient for debugging.
  webPackProdConfig.devtool = 'source-map';
  // plugins for development
  webPackProdConfig.plugins = webPackProdConfig.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.BROWSER': JSON.stringify(true),
    })
  ]);

  return webPackProdConfig;
};
