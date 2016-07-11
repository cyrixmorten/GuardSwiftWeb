var _ = require('cloud/lib/underscore.js');

var regularReport = require('cloud/pdf/definitions/regularReport.js');
var districtReport = require('cloud/pdf/definitions/districtReport.js');
var staticReport = require('cloud/pdf/definitions/staticReport.js');


var reportUtils = require('cloud/pdf/reportUtils.js');

var fetchReportSettings = function (report) {

    var getSettingsColumn = function() {
        if (report.has('circuitUnit')) {
            return 'regularReportSettings';
        }
        if (report.has('districtWatchUnit')) {
            return 'districtReportSettings';
        }
        if (report.has('staticTask')) {
            return 'staticReportSettings';
        }
    };

    var fetchReportSettings = function () {
        var settingsCol = getSettingsColumn();

        console.log('settingsCol: ' + settingsCol);

        if (_.isEmpty(settingsCol)) {
            return new Parse.Promise.error('No definition matching report');
        }

        return reportUtils.fetchUser(report).then(function (user) {
            return user.get(settingsCol).fetch();
        });
    };


    return fetchReportSettings()
};

exports.createDoc = function (report) {

    var timeZone;
    
    return reportUtils.fetchUser(report)
        .then(function(user) {
        
            timeZone = (user.has('timeZone')) ? user.get('timeZone') : 'Europe/Copenhagen';
        
            return fetchReportSettings(report);
        })
        .then(function(settings) {
            if (report.has('circuitUnit')) {
                return regularReport.createDoc(report, settings, timeZone);
            }
            if (report.has('districtWatchUnit')) {
                return districtReport.createDoc(report, settings, timeZone);
            }
            if (report.has('staticTask')) {
                return staticReport.createDoc(report, settings, timeZone);
            }
        });



};