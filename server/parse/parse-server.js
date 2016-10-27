var express = require('express'),
    path = require('path');

var app = express();

exports.start = function() {
    
    var S3Adapter = require('parse-server').S3Adapter;
    var ParseServer = require('parse-server').ParseServer;

    var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

    if (!databaseUri) {
        console.log('DATABASE_URI not specified, falling back to localhost.');
    }

    var parseApi = new ParseServer({
        databaseURI: databaseUri, //'mongodb://localhost:27017/dev',
        cloud: './cloud/main.js',
        appId: process.env.APP_ID || 'guardswift',
        fileKey: process.env.FILE_KEY,
        masterKey: process.env.MASTER_KEY, // Add your master key here. Keep it secret!
        serverURL: process.env.PARSE_SERVER_URL, // Don't forget to change to https if needed
        liveQuery: {
            classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
        },
        filesAdapter: new S3Adapter(
            process.env.S3_KEY,
            process.env.S3_SECRET,
            process.env.S3_BUCKET || 'guardswift',
            { directAccess: true }
        )
    });

// Serve static assets from the /public folder
    app.use('../public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
    var mountPath = process.env.PARSE_MOUNT || '/parse';
    app.use(mountPath, parseApi);


    var port = process.env.PORT || 1337;
    var httpServer = require('http').createServer(app);
    httpServer.listen(port, function() {
        console.log('parse-server running on port ' + port + '.');
    });

// This will enable the Live Query real-time server
    ParseServer.createLiveQueryServer(httpServer);  
};