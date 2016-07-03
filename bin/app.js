var express = require('express');
var app = express();

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var swig = require('swig');
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '../projects/'));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../projects/')));
app.use(express.static(path.join(__dirname, '../public/')));
var getRenderParams = require('./buildConfig');

var cors = require('cors');
var port = process.env.PORT || 40000;
var NODE_ENV = app.get('env') || 'production';
var _ = require('lodash');

var router = require('./routes/router');
var ajaxRouter = require('./routes/ajaxRouter');


app.use('/api', cors(), ajaxRouter);

app.use('/', function (req, res) {
  var renderParams = getRenderParams(req, NODE_ENV);
  var cssTemplate = '<link rel="stylesheet" type="text/css" href="${resourceUrl}">';
  var jsTemplate = '<script type="text/javascript" src="${resourceUrl}"></script>';
  var stylesHtml = "";
  var scriptsHtml = "";
  renderParams.cssBundles.map(function (cssUrl) {
    stylesHtml += _.template(cssTemplate)({
      resourceUrl: cssUrl
    })
  });
  renderParams.jsBundles.map(function (jsUrl) {
    scriptsHtml += _.template(jsTemplate)({
      resourceUrl: jsUrl
    })
  });
  var projects = renderParams.projects || {};
  var angularModuleName = projects.projectName + '_' + projects.subProjectName;
  console.log("angularModuleName", angularModuleName);
  var html = '<!DOCTYPE html>' +
    ' <html ng-app="' + angularModuleName + '">' +
    '  <head>' +
    '  <meta charset="utf-8">' +
    '  <meta name="renderer" content="webkit">' +
    '  <meta http-equiv="Cache-Control" content="no-siteapp">' +
    '  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">' +
    '  <meta name="apple-touch-fullscreen" content="YES" />' +
    '  <meta name="format-detection" content="telephone=no,email=no" />' +
    '  <meta name="apple-mobile-web-app-capable" content="yes" />' +
    '  <meta name="apple-touch-fullscreen" content="yes" />' +
    '  <meta name="apple-mobile-web-app-status-bar-style" content="black" />' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">' +
    stylesHtml +
    '</head>' +
    '  <body>' +
    '  <!-- views will be injected here -->' +
    '  <div class="page" ui-view></div>' +
    '<script>' +
    '  window.GLOBAL_APP_NAME = "app";' +
    '  window.GLOBAL_ENV_NAME = "prod";' +
    '  window.GLOBAL_DEBUG_MODE = true;' +
    '  window.GLOBAL = {};' +
    '</script>' +
    scriptsHtml +
    '  </body>' +
    '</html>';

  res.send(html);

});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = app.listen(port, function () {
  console.log('===Express server listening on port %d ===', server.address().port);
});


function urlHandle(url) {
  if (!url) {
    return ""
  }
  ;
  if (url.indexOf("/") == 0) {
    return url.substring(1);
  }
  return url;
}


module.exports = app;
