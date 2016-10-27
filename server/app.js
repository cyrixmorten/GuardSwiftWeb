var GuardSwiftVersion = 325;

require("dotenv").config({ path: 'local.env' });
var requireEnv = require("require-environment-variables");
requireEnv([
  'FILE_KEY',
  'MASTER_KEY',
  'SERVER_URL',
  'S3_KEY',
  'S3_SECRET',
  'DEPLOYMENT_MODE',
  'GOOGLE_GEOCODE_API_KEY'
]);


/**
 * Module dependencies
 */
var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  morgan = require('morgan'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path'),
  parseServer = require('./parse/parse-server'),
  parseDashboard = require('./parse/parse-dashboard');

var app = module.exports = express();


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
  console.log('GuardSwift running on port ' + app.get('port'));
});

console.log('Starting Parse Server');
parseServer.start();
console.log('Starting Parse Dashboard');
parseDashboard.start();
