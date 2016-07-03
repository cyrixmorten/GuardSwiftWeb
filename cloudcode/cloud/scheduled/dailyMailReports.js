var moment = require('cloud/lib/moment/moment.min.js');
var _ = require('underscore');

Parse.Cloud.job("dailyMailReports", function (request, status) {
    Parse.Cloud.useMasterKey();

    var now = moment();
    var yesterday = moment().subtract(1, 'days');

    var query = new Parse.Query(Parse.User);
    query.each(
        function (company) {
            return sendReportsToClients(company, yesterday.toDate(), now.toDate(), 'REGULAR');
            //var sendSummaryReportToCompany = sendRegularReportSummaryToCompany(company, yesterday.toDate(), now.toDate());

        })
        .then(function () {
            // todo generate daily summary
            status.success('Done generating mail reports');
        }, function (error) {
            console.error(error);
            status.error(error);

        });
});

var restrictQuery = function(query) {
    return function(company, fromDate, toDate) {
        query.equalTo('owner', company);
        query.greaterThan("deviceTimestamp", fromDate);
        query.lessThan("deviceTimestamp", toDate);
    }
};

var sendReportsToClients = function (company, fromDate, toDate, taskType) {

    var reportQuery = new Parse.Query("Report");

    reportQuery.equalTo('taskTypeName', taskType);

    restrictQuery(reportQuery)(company, fromDate, toDate);

    return reportQuery.each(function (report) {
        return Parse.Cloud.run('sendReport', {
            reportId: report.id
        });
    })
};

var sendRegularReportSummaryToCompany = function(company, fromDate, toDate) {
    var reportQuery = new Parse.Query('CircuitStarted');

    restrictQuery(reportQuery)(company, fromDate, toDate);

    return reportQuery.each(function (group) {
        return Parse.Cloud.run('sendSummaryReport', {
            taskGroup: group.id
        });
    })
};


