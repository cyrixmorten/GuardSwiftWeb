var GuardSwiftVersion = 325;

/**
 * Module dependencies
 */
var express = require('express'),
  router = require('express').Router(),
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
app.engine('html', cons.swig);
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

var baseRouter = express.Router();

/**
 * Base
 */

baseRouter.route('/').get(function(req, res) {
  res.render('index');
});

app.use('/', baseRouter);

/**
 * API
 */

var apiRouter = express.Router();

// JSON API
apiRouter.route('/pdfmake').post(api.pdfmake);
apiRouter.route('/datauri').post(api.datauri);

apiRouter.route('/version').get(function(req, res) {
  res.send(GuardSwiftVersion.toString());
});

apiRouter.route('/download').get(function(req, res){
  var path = __dirname  + '/files/guardswift.apk';
  res.download(path);
});

app.use('/api', apiRouter);

// Redirect all others to the index (HTML5 history)
//app.get('*', routes.index);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
