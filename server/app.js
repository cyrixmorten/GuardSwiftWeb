var GuardSwiftVersion = 315;

/**
 * Module dependencies
 */
var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('error-handler'),
  morgan = require('morgan'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();


/**
 * Configuration
 */

var clientPath = path.join(__dirname, '../app');
// all environments
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride());
app.use(express.static(clientPath));

var cons = require('consolidate');

// view engine setup
app.engine('html', cons.swig)
app.set('views', clientPath);
app.set('view engine', 'html');

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  //app.use(express.errorHandler());
}

// production only
if (env === 'production') {

}


/**
 * Routes
 */

// Serve Index
app.get('/', routes.index);


// JSON API
app.get('/api/version', function(req, res) {
  res.send(GuardSwiftVersion.toString());
});
app.get('/api/apk', function(req, res, next){
  var file = req.params.file
      , path = __dirname  + 'guardswift.apk';

  res.download(path);
});
app.post('/api/pdfmake', api.pdfmake);
app.post('/api/datauri', api.datauri);

// Redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
