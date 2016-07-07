var moment = require('cloud/lib/moment/moment-timezone.js');
var _ = require('cloud/lib/underscore.js');

exports.fetchUser = function (report) {
	return report.get('owner').fetch();
};


exports.getPDFUrl = function(report) {
	return report.get('pdf').url();
};

exports.hasExistingPDF = function (report) {
	var pdfCreatedAt = report.get('pdfCreatedAt');
	var updatedAt = report.get('updatedAt');

	return pdfCreatedAt && Math.abs(moment(pdfCreatedAt).diff(moment(updatedAt), 'seconds')) < 10;
};

exports.readExistingPDF = function (report) {
	return Parse.Cloud.httpRequest({
		method: 'GET',
		url: exports.getPDFUrl(report),
		headers: {
			'Content-Type': 'application/pdf'
		}
	})
};

exports.deleteExistingPDF = function (report) {

	var promise = new Parse.Promise.as();

	if (report.has('pdf')) {

		promise = Parse.Cloud.run('fileDelete', {
			file: report.get('pdf')
		});
	}

	promise.fail(function (error) {
		console.error({
			message: 'Error deleting report',
			error: error
		});
	});

	return promise;
};


exports.generatePDF = function (docDefinition) {
	return Parse.Cloud.httpRequest({
		method: 'POST',
		url: 'http://www.guardswift.com/api/pdfmake',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: docDefinition
	})
};

exports.generatePDFParseFile = function (httpResponse) {

	var file = new Parse.File("report.pdf", {
		base64: httpResponse.buffer.toString('base64', 0, httpResponse.buffer.length)
	}, 'application/pdf');

	return file.save()

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