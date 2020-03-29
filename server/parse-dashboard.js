exports.start = function () {
    var express = require('express');
    var ParseDashboard = require('parse-dashboard');

    var allowInsecureHTTP = true;

    var dashboard = new ParseDashboard({
        "apps": [
            {
                "serverURL": process.env.GUARDSWIFT_PARSE_SERVER,
                "appId": process.env.GUARDSWIFT_APP_ID,
                "masterKey": process.env.GUARDSWIFT_MASTER_KEY,
                "appName": "GuardSwift",
                "production": true
            },
            {
                "serverURL": process.env.GUARDSWIFT_DEV_PARSE_SERVER,
                "appId": process.env.GUARDSWIFT_APP_ID,
                "masterKey": process.env.GUARDSWIFT_MASTER_KEY,
                "appName": "GuardSwift dev"
            },
            {
                "serverURL": process.env.GUARDSWIFT_LOCAL_PARSE_SERVER,
                "appId": process.env.GUARDSWIFT_APP_ID,
                "masterKey": process.env.GUARDSWIFT_MASTER_KEY,
                "appName": "GuardSwift local"
            },
            {
                "serverURL": process.env.TURIOS_PARSE_SERVER,
                "appId": process.env.TURIOS_APP_ID,
                "masterKey": process.env.TURIOS_MASTER_KEY,
                "appName": "Turios",
                "production": true
            }
        ],
        // "users": [
        //     {
        //         "user": "cyrix",
        //         "pass": "pass"
        //     }
        // ],
        // "useEncryptedPasswords": false,
        "trustProxy": 1
    }, allowInsecureHTTP);

    var app = express();

    // make the Parse Dashboard available at /dashboard
    app.use('/dashboard', dashboard);

    var httpServer = require('http').createServer(app);
    
    httpServer.listen(4040, function() {
        console.log('parse-dashboard running on port 4040');
    });
};