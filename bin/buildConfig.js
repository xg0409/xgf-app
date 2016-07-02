var path = require('path');
var url = require('url');
var config = require('../build.config.js');
var _ = require('lodash');


function getRenderParams(req, env) {
  var options = config.options;
  var projects = config.projects;
  var cssBundles = [];
  var jsBundles = [];
  var targetObject;

  var cdnRoot = (env == "production") ? options.assets.prod : options.assets.dev;

  // var queryPath = req.path;
  var queryPath = "/activities/activities1/";
  Object.keys(projects).forEach(function (projectName) {

    var projectObject = projects[projectName];
    var _metaInfo = projectObject._metaInfo;
    _.forEach(projectObject, function (value, key) {
      var urlMatch = value.match;
      if (urlMatch && urlMatch.test(queryPath)) {
        value._metaInfo = _.extend(_metaInfo, value._metaInfo);
        targetObject = value;
        return;
      }
    });
  });

  _.forEach(targetObject.cssBundles || [], function (cssUrl) {
    cssBundles.push(url.resolve(cdnRoot,_.template(cssUrl)({
      version:targetObject._metaInfo.version
    })))
  });

  _.forEach(targetObject.jsBundles || [], function (cssUrl) {
    jsBundles.push(url.resolve(cdnRoot,_.template(cssUrl)({
      version:targetObject._metaInfo.version
    })))
  });

  return {
    options:options,
    projects:projects,
    jsBundles:jsBundles,
    cssBundles:cssBundles
  }

}

module.exports = getRenderParams;
