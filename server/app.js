require("dotenv").config({ path: 'local.env' });
var requireEnv = require("require-environment-variables");



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
  path = require('path');

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


app.use('/api', apiRouter);

// Redirect all others to the index (HTML5 history)
//app.get('*', routes.index);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('GuardSwift running on port ' + app.get('port'));
});

// development only
if (env === 'development') {
    //app.use(express.errorHandler());
    requireEnv([
        'GUARDSWIFT_PARSE_SERVER',
        'GUARDSWIFT_DEV_PARSE_SERVER',
        'GUARDSWIFT_LOCAL_PARSE_SERVER',
        'GUARDSWIFT_APP_ID',
        'GUARDSWIFT_MASTER_KEY'
    ]);

    console.log('Starting Parse Dashboard');
    require('./parse-dashboard').start();
}
