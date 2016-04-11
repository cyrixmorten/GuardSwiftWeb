var moment = require('cloud/lib/moment/moment.min.js');
var _ = require('underscore');

Parse.Cloud.job("dailyMailReports", function (request, status) {
    Parse.Cloud.useMasterKey();

    var now = moment();
    var yesterday = moment().subtract(1, 'days');

    var query = new Parse.Query(Parse.User);
    query.each(
        function (user) {
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

    console.log('taskTypeName', taskType);
    console.log('from: ' + moment(fromDate).format('DD/MM-HH:mm'));
    console.log('to: ' + moment(toDate).format('DD/MM-HH:mm'));

    return reportQuery.count().then(function(count) {
        console.log('Sending ' + count +' reports for user ' + user.get('username'));
        return new Parse.Promise.as(count);
    }).then(function() {
        return reportQuery.each(function (report) {
            console.log('Sending report ' + report.id);
            return Parse.Cloud.run('sendReport', {
                reportId: report.id
            });
        });
    })

};


