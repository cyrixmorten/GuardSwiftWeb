var moment = require('cloud/lib/moment/moment-timezone.js');
var s = require("cloud/lib/underscore.string.min.js");
var _ = require('cloud/lib/underscore.js');

var pdfUtils = require('cloud/utils/pdf.js');
var eventUtils =  require('cloud/utils/events.js');

var docDefaults = require('cloud/reports/docDefaults.js');
var reportUtils = require('cloud/reports/reportUtils.js');


/**
 * Generate regular report doc definition
 *
 * @param report
 * @param settings
 * @param timeZone
 */
var regularReportDefinition = function (report, settings, timeZone) {

    var events = eventUtils.reportEvents(report, timeZone);

    var arrivalTimestamps = function() {
        if (_.isEmpty(events.arrivedTimestamps)) {
            return '';
        }

        var arrivals = '';
        var delimiter = ', ';
        _.each(events.arrivedTimestamps, function(timestamp) {
            arrivals += timestamp + delimiter;
        });

        return s(arrivals).rtrim(delimiter).value();
    };

    var backgroundHeaderImage = docDefaults.backgroundHeaderImage(settings);

    return _.extend(docDefaults.doc(report, timeZone), {

        background: backgroundHeaderImage,

        header: docDefaults.header(report, timeZone),

        content: [
            docDefaults.contentHeader(report, backgroundHeaderImage),
            pdfUtils.leftRightAlignedContent({
                textLeft: ['Vægter var ved adressen kl: ', {text: arrivalTimestamps(), bold: true}],
                textRight: [{text: 'Rapport id: ' + report.get('reportId'), color: 'grey'}],
                margin: [0, 10],
                style: {bold: true}
            }),
            pdfUtils.tableBorderedWithHeader({
                widths : ['*', 50, '*', '*', '*'],
                header : ['Hændelse', 'Antal', 'Personer', 'Placering', 'Bemærkninger'],
                content: _.zip(events.eventName, events.amount, events.people, events.location, events.remarks)
            })
        ],

        footer: docDefaults.footer(report),


        styles: docDefaults.styles()

    });
};

/**
 * Generate static report doc definition
 *
 * @param report
 * @param settings
 * @param timeZone
 */
var staticReportDefinition = function (report, settings, timeZone) {

    var events = eventUtils.reportEvents(report, timeZone);

    return _.extend(docDefaults.doc(report, timeZone), {

        background: docDefaults.backgroundHeaderImage(settings),

        header: docDefaults.header(report, timeZone),

        content: [
            docDefaults.contentHeader(report),
            pdfUtils.tableNoBorders({
                widths: [50, '*'],
                content: _.zip(events.timestamps, events.remarks)
            })
        ],

        footer: docDefaults.footer(report),


        styles: docDefaults.styles()

    });
};

exports.createDocDefinition = function (report) {

    var timeZone;
    
    return reportUtils.fetchUser(report)
        .then(function(user) {
        
            timeZone = (user.has('timeZone')) ? user.get('timeZone') : 'Europe/Copenhagen';
        
            return reportUtils.fetchReportSettingsMatching(report);
        })
        .then(function(settings) {
            if (report.has('circuitUnit')) {
                return regularReportDefinition(report, settings, timeZone);
            }
            if (report.has('staticTask')) {
                return staticReportDefinition(report, settings, timeZone);
            }
        });



};