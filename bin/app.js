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
app.set('views',path.join( __dirname , '../projects/'));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../projects/')));
app.use(express.static(path.join(__dirname, '../public/')));
var getRenderParams = require('./buildConfig');

var cors = require('cors');
var port = process.env.PORT || 40000;

var router = require('./routes/router');
var ajaxRouter =require('./routes/ajaxRouter');


app.use('/api', cors(), ajaxRouter);
app.use('/', cors(), router);

// app.use('*', function(req, res){
//   // var renderParams = getRenderParams(req, NODE_ENV);
//   // var cssTemplate = '<link rel="stylesheet" type="text/css" href="${resourceUrl}">';
//   // var jsTemplate = '<script type="text/javascript" src="${resourceUrl}"></script>';
//   // var cssList = "";
//   // var jsList = "";
//   // renderParams.cssBundles.map(function (cssUrl) {
//   //   cssList += _.template(cssTemplate)({
//   //     resourceUrl: cssUrl
//   //   })
//   // });
//   // renderParams.jsBundles.map(function (jsUrl) {
//   //   jsList += _.template(jsTemplate)({
//   //     resourceUrl: jsUrl
//   //   })
//   // });
//   var renderUrl = urlHandle(req.originalUrl+"views/index");
//
//   console.log("renderUrl",renderUrl)
//   res.render(renderUrl, {
//     title:'XG TITLE'
//     // cssList: cssList,
//     // jsList: jsList
//   });
//
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = app.listen(port, function() {
  console.log('===Express server listening on port %d ===', server.address().port);
});


function urlHandle(url){
  if(!url){return ""};
  if(url.indexOf("/") == 0){
    return url.substring(1);
  }
  return url;
}


module.exports = app;
