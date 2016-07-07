var _ = require('cloud/lib/underscore.js');

var pdfUtils = require('cloud/utils/pdf.js');
var eventUtils =  require('cloud/utils/events.js');

var docDefaults = require('cloud/pdf/definitions/docDefaults.js');


/**
 * Generate static report doc definition
 *
 * @param report
 * @param settings
 * @param timeZone
 */
exports.createDoc = function (report, settings, timeZone) {

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