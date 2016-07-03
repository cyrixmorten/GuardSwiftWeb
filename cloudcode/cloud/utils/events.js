var moment = require('cloud/lib/moment/moment-timezone.js');
var _ = require('cloud/lib/underscore.js');


var eventsMap = function (eventLogs, timeZone) {

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

/**
 * Extracts categorised event information for given report
 */
exports.reportEvents = function (report, timeZone) {
	return eventsMap(report.get('eventLogs'), timeZone);
};