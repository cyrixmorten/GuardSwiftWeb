var moment = require('cloud/lib/moment/moment-timezone.js');
var _ = require('cloud/lib/underscore.js');


exports.getReportSettings = function (report) {

	var fetchReportSettings = function (user, settingsCol) {
		if (_.isEmpty(settingsCol)) {
			return new Parse.Promise.error('No definition matching report');
		}

		return user.fetch().then(function (user) {
			return user.get(settingsCol).fetch();
		});
	};


	var getSettingsColumn = function(report) {
		if (report.has('circuitUnit')) {
			return 'regularReportSettings';
		}
		if (report.has('staticTask')) {
			return 'staticReportSettings';
		}
	};

	var settingsColumn = getSettingsColumn(report);

	return fetchReportSettings(report.get('owner'), settingsColumn)
};

/**
 * Extracts categorised event information for given report
 */
exports.reportEventsMap = function (report, timeZone) {
	return exports.eventsMap(report.get('eventLogs'), timeZone);
};

exports.eventsMap = function (eventLogs, timeZone) {

	var arrivedEvents = _.filter(eventLogs, function (eventLog) {
		return eventLog.get('task_event') === 'ARRIVE';
	});

	var otherEvents = _.filter(eventLogs, function (eventLog) {
		return eventLog.get('task_event') === 'OTHER';
	});

	return {
		arrivedTimestamps: _.map(arrivedEvents, function (log) {
			var timeStamp = log.get('deviceTimestamp');

			return moment(timeStamp).tz(timeZone).format('HH:mm');
		}),

		timestamps: _.map(otherEvents, function (log) {
			var timeStamp = log.get('deviceTimestamp');

			return moment(timeStamp).tz(timeZone).format('HH:mm');
		}),

		eventName: _.map(otherEvents, function (log) {
			return log.get('event') || '';
		}),

		amount: _.map(otherEvents, function (log) {
			return (log.has('amount') && log.get('amount') !== 0) ? log.get('amount').toString() : '';
		}),

		people: _.map(otherEvents, function (log) {
			return log.get('people') || '';
		}),

		location: _.map(otherEvents, function (log) {
			return log.get('clientLocation') || '';
		}),

		remarks: _.map(otherEvents, function (log) {
			return log.get('remarks') || '';
		})
	};
};