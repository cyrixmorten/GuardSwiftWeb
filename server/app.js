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
 * SETUP PARSE SERVER
 */

var S3Adapter = require('parse-server').S3Adapter;
var ParseServer = require('parse-server').ParseServer;

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var parseApi = new ParseServer({
  databaseURI: databaseUri, //'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN, // || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID,
  fileKey: process.env.FILE_KEY,
  masterKey: process.env.MASTER_KEY, //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  },
  filesAdapter: new S3Adapter(
      process.env.S3_KEY,
      process.env.S3_SECRET,
      process.env.S3_BUCKET,
      { directAccess: true }
  )
});

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, parseApi);


var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
  console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);

/**
 * CONFIGURE SERVER
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
