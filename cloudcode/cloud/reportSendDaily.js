var moment = require('cloud/lib/moment/moment.min.js');
var _ = require('underscore');

Parse.Cloud.job("dailyMailReports", function (request, status) {

    var now = moment();
    var yesterday = moment().subtract(1, 'days');

    var query = new Parse.Query(Parse.User);
    query.each(
        function (user) {

            console.log('Sending reports for user ' + user.get('username'));

            return sendReportsMatching(user, 'REGULAR', yesterday.toDate(), now.toDate());
        })
        .then(function () {
            // todo generate daily summary
            status.success('Done generating mail reports');
        }, function (error) {
            console.error(error);
            status.error(error);

        });
});

var sendReportsMatching = function (user, taskType, fromDate, toDate) {

    var reportQuery = new Parse.Query("Report");

    reportQuery.equalTo('owner', user);
    reportQuery.equalTo('taskTypeName', taskType);
    reportQuery.greaterThan("deviceTimestamp", fromDate);
    reportQuery.lessThan("deviceTimestamp", toDate);

    return reportQuery.each(function (report) {
        console.log('Sending report ' + report.id);
        return Parse.Cloud.run('sendReport', {
            reportId: report.id
        });
    });
};


