var moment = require('cloud/lib/moment/moment-timezone.js');
var s = require("cloud/lib/underscore.string.min.js");
var _ = require('cloud/lib/underscore.js');

var pdfUtils = require('cloud/utils/pdf.js');


var docDefaults = require('cloud/pdf/definitions/docDefaults.js');
var reportUtils = require('cloud/pdf/reportUtils.js');


/**
 * Generate regular report doc definition
 *
 * @param report
 * @param settings
 * @param timeZone
 */
exports.createDoc = function (report, settings, timeZone) {

    var events = reportUtils.reportEventsMap(report, timeZone);

    var arrivalTimestamps = function () {
        if (_.isEmpty(events.arrivedTimestamps)) {
            return '';
        }

        var arrivals = '';
        var delimiter = ', ';
        _.each(events.arrivedTimestamps, function (timestamp) {
            arrivals += timestamp + delimiter;
        });

        return s(arrivals).rtrim(delimiter).value();
    };

    var backgroundHeaderImage = docDefaults.backgroundHeaderImage(settings);


    var uniqueEvents = function () {
        var combinedContent = [];
        for (var i = 0; i < events.eventName.length; i++) {
            combinedContent.push(
                events.eventName[i] +
                events.amount[i] +
                events.people[i] +
                events.location[i] +
                events.remarks[i]
            )
        }


        var uniqueContent = [];
        for (var j = 0; j < combinedContent.length; j++) {
            if (!_.includes(uniqueContent, combinedContent[j])) {
                uniqueContent.push(combinedContent[j]);
            } else if (!_.isEmpty(combinedContent[j])) {
                // strip off duplicates from events
                events.eventName.splice(j, 1);
                events.amount.splice(j, 1);
                events.people.splice(j, 1);
                events.location.splice(j, 1);
                events.remarks.splice(j, 1);
            }
        }

        return _.zip(events.eventName, events.amount, events.people, events.location, events.remarks);
    };


    var reportContent = function() {
        var content = [];

        // client info
        var header = docDefaults.contentHeader(report, backgroundHeaderImage);
        var arrivalAndReportId = pdfUtils.leftRightAlignedContent({
            textLeft: ['Vægter var ved adressen kl: ', {text: arrivalTimestamps(), bold: true}],
            textRight: [{text: 'Rapport id: ' + report.get('reportId'), color: 'grey'}],
            margin: [0, 10],
            style: {bold: true}
        });
        var writtenEvents = uniqueEvents();
        var reportedEvents = pdfUtils.tableBorderedWithHeader({
            widths: ['*', 50, '*', '*', '*'],
            header: ['Hændelse', 'Antal', 'Personer', 'Placering', 'Bemærkninger'],
            content: uniqueEvents()
        });

        // todo: make part of report settings
        var noEventsText = {text: "Ingen uregelmæssigheder blev observeret under tilsynet", margin: [ 0, 10, 0, 0 ]};

        content.push(header);
        content.push(arrivalAndReportId);
        if (!_.isEmpty(writtenEvents)) {
            content.push(reportedEvents);
        } else {
            content.push(noEventsText);
        }

        return content;
    };
    return _.extend(docDefaults.doc(report, timeZone), {
        background: backgroundHeaderImage,
        header: docDefaults.header(report, timeZone),
        content: reportContent(),
        footer: docDefaults.footer(report),
        styles: docDefaults.styles()
    });
};
