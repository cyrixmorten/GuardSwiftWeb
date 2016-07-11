var moment = require('cloud/lib/moment/moment-timezone.js');
var _ = require('cloud/lib/underscore.js');

var pdfUtils = require('cloud/utils/pdf.js');

var docDefaults = require('cloud/pdf/definitions/docDefaults.js');
var reportUtils = require('cloud/pdf/reportUtils.js');


/**
 * Generate static report doc definition
 *
 * @param report
 * @param settings
 * @param timeZone
 */
exports.createDoc = function (report, settings, timeZone) {

    var districtName = report.get('districtWatchStarted').get('name');
    var events = reportUtils.reportEventsMap(report, timeZone);


    return _.extend(docDefaults.doc(report, timeZone), {
        info: {
            title: districtName + ' ' + moment(report.get('createdAt')).tz(timeZone).format('DD-MM-YYYY'),
            author: 'GuardSwift'
        },
        background: docDefaults.backgroundHeaderImage(settings),

        header: pdfUtils.leftRightAlignedContent({
            textRight: 'Dato: ' + moment(report.get('createdAt')).tz(timeZone).format('DD-MM-YYYY'),
            margin: [10, 10]
        }),

        content: [
            pdfUtils.header(districtName, '', 60),
            pdfUtils.tableNoBorders({
                widths: [50, 150, 400],
                content: _.zip(events.arrivedTimestamps, events.arrivedGuardNames, events.arrivedClientAddress)
            })
        ],

        footer: docDefaults.footer(report),


        styles: docDefaults.styles()

    });
};