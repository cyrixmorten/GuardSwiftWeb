exports.start = function () {
    var express = require('express');
    var ParseDashboard = require('parse-dashboard');

    var allowInsecureHTTP = true;

    var dashboard = new ParseDashboard({
        "apps": [
            {
                "serverURL": process.env.SERVER_URL,
                "appId": process.env.APP_ID,
                "masterKey": process.env.MASTER_KEY,
                "appName": "GuardSwiftDev"
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