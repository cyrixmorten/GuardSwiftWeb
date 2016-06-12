var moment = require('cloud/lib/moment/moment-timezone.js');
var s = require("cloud/lib/underscore.string.min.js");
var _ = require('cloud/lib/underscore.js');

var reportUtils = require('cloud/reportUtils.js');
var pdfUtils = require('cloud/pdfUtils.js');

// todo store/retrieve from user
var timeZone = 'Europe/Copenhagen';


var createDocDefinition = function (report) {

    return reportUtils.getReportSettings(report).then(function(settings) {
        if (report.has('circuitUnit')) {
            return regularReportDefinition(report, settings);
        }
        if (report.has('staticTask')) {
            return staticReportDefinition(report, settings);
        }
    });

};

Parse.Cloud.define("reportToPDF", function (request, response) {
    Parse.Cloud.useMasterKey();

    if (!request.params.reportId) {
        response.error('missing reportId');
        return;
    }


    var query = new Parse.Query('Report');
    query.equalTo('objectId', request.params.reportId);
    query.include('eventLogs');


    var result = {
        createdPDF: true,
        report: {},
        pdfUrl: '',
        httpResponse: {}
    };

    query.first().then(function (report) {

        result.report = report;

        var pdfCreatedAt = report.get('pdfCreatedAt');
        var updatedAt = report.get('updatedAt');

        var hasPDF = pdfCreatedAt && Math.abs(moment(pdfCreatedAt).diff(moment(updatedAt), 'seconds')) < 10;

        if (hasPDF) {

            console.log('fetching pdf');

            result.createdPDF = false;
            result.pdfUrl = report.get('pdf').url();

            /**
             * Save time and resources by simply returning the stored report
             */

            return Parse.Cloud.httpRequest({
                method: 'GET',
                url: result.pdfUrl,
                headers: {
                    'Content-Type': 'application/pdf'
                }
            })

        } else {

            console.log('creating pdf');

            result.createdPDF = true;

            var deletePromise = function (report) {

                var promise = new Parse.Promise.as();

                if (report.has('pdf')) {

                    promise = Parse.Cloud.run('fileDelete', {
                        file: report.get('pdf')
                    });
                }

                promise.fail(function(error) {
                    console.error({
                        message: 'Error deleting report',
                        error: error
                    });
                });

                return promise;
            };

            /**
             *  Create a new PDF report and store it
             */


            return deletePromise(report).always(function () {
                // no matter the outcome of the delete, we continue creating the report
                return createDocDefinition(report);
            }).then(function (docDefinition) {

                console.log(JSON.stringify(docDefinition));

                return Parse.Cloud.httpRequest({
                    method: 'POST',
                    url: 'http://www.guardswift.com/api/pdfmake',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: docDefinition
                })
            }).fail(function (error) {
                console.error({
                    message: 'Error during PDF creation',
                    error: error
                });
            });
        }

    }).then(function (httpResponse) {

        result.httpResponse = httpResponse;

        var promise = new Parse.Promise.as(result);

        if (result.createdPDF) {

            var file = new Parse.File("report.pdf", {
                base64: httpResponse.buffer.toString('base64', 0, httpResponse.buffer.length)
            }, 'application/pdf');

            promise = promise.then(function () {
                    return file.save()
                })
                .then(function () {

                    result.report.set('pdfCreatedAt', new Date());
                    result.report.set('pdf', file);

                    return result.report.save();
                })
                .then(function (report) {
                    // update result report
                    result.report = report;
                    result.pdfUrl = report.get('pdf').url();
                }).fail(function(error) {
                    console.error(
                        {
                            message: 'Error saving PDF report',
                            error: error
                        }
                    )
                });
        }

        return promise;

    }).then(function () {

            console.log('pdf done', result);

            response.success(result);
        })
        .fail(function (error) {

            response.error(error);

        });

});

/**
 * Doc info and margins
 *
 * @param report
 * @returns {{info: {title: string, author: string}, pageMargins: number[]}}
 */
var defaultDoc = function (report) {
    return {
        info: {
            title: report.get('clientName') + ' ' + moment(report.get('createdAt')).tz(timeZone).format('DD-MM-YYYY'),
            author: 'GuardSwift'
        },

        pageMargins: [40, 60, 40, 60]
    }
};

/**
 * Top content of document
 *
 * @param report
 * @returns {{header: {columns: *[], margin: number[]}}}
 */
var defaultHeader = function (report) {

    var guard = {
        id: report.get('guardId'),
        name: report.get('guardName')
    };

    return pdfUtils.leftRightAlignedContent({
        textLeft: [
            {text: 'Vagt: ', bold: true}, guard.name + ' ' + guard.id
        ],
        textRight: 'Dato: ' + moment(report.get('createdAt')).tz(timeZone).format('DD-MM-YYYY'),
        margin: [10, 10]
    })
};

/**
 * Header image is set as background to allow header and image on same horizontal space
 * for 'left' and 'right' alignment
 *
 * @param report
 * @param settings
 * @returns {{}}
 */
var defaultBackgroundHeaderImage = function (settings) {

    var result = {};

    if (settings.has('headerLogo')) {
        var headerLogo = settings.get('headerLogo');

        if (headerLogo.datauri) {
            result = {
                image: headerLogo.datauri,
                margin: [15, 60, 15, 0]
            }
        }

        /** defaults **/
        result.alignment = "center";


        if (headerLogo.alignment) {
            result.alignment = headerLogo.alignment;
        }

        if (headerLogo.stretch) {
            // make image take up full width
            result.width = (21 / 2.54) * 72 - (2 * 40); // (cm / 2.54) * dpi - margin
        } else {
            if (headerLogo.width) {
                result.width = headerLogo.width
            }


            if (headerLogo.height) {
                result.height = headerLogo.height
            }

            // if neither height or width is specified, set width to 3cm
            // from pdfmake: if you specify width, image will scale proportionally
            if (!headerLogo.width && !headerLogo.height) {
                result.width = (3 / 2.54) * 72;
            }
        }


    }

    return result;
};

/**
 * Title of the document, takes an optional backgroundHeaderImage argument to determine whether to
 * add additional margin due to image taking up space over the title.
 *
 * @param report
 * @param backgroundHeaderImage
 * @returns {{text: *[], margin: number[]}}
 */
var defaultContentHeader = function (report, backgroundHeaderImage) {

    var pushTopMargin = (backgroundHeaderImage && backgroundHeaderImage.alignment && backgroundHeaderImage.alignment === 'center') ? 60 : 0;

    var client = {
        name: report.get('clientName'),
        address: report.get('clientAddress') + ' ' + report.get('clientAddressNumber')
    };

    return pdfUtils.header(client.name, client.address, pushTopMargin)
};

var defaultFooter = function (report) {
    return [
        {text: 'YDERLIGERE OPLYSNINGER PÅ TLF. 86 16 46 44', alignment: 'center'},
        {
            text: 'Rapporten er genereret af GuardSwift - elektroniske vagtrapporter via smartphones',
            alignment: 'center'
        }
    ]
};


/**
 * Generate regular report doc definition
 *
 * @param report
 * @param settings
 */
var regularReportDefinition = function (report, settings) {

    var contentMap = reportUtils.reportEventsMap(report, timeZone);

    var guardArrivalText = function () {
        if (_.isEmpty(contentMap.arrivedTimestamps)) {
            return '';
        }

        var arrivalTimestamps = function() {
            var arrivals = '';
            var delimiter = ', ';
            _.each(contentMap.arrivedTimestamps, function(timestamp) {
                arrivals += timestamp + delimiter;
            });

            return s(arrivals).rtrim(delimiter).value();
        };


        return pdfUtils.leftRightAlignedContent({
            textLeft: ['Vægter var ved adressen kl: ', {text: arrivalTimestamps(), bold: true}],
            textRight: [{text: 'Rapport id: ' + report.get('reportId'), color: 'grey'}],
            margin: [0, 10],
            style: {bold: true}
        });
    };

    var backgroundHeaderImage = defaultBackgroundHeaderImage(settings);

    return _.extend(defaultDoc(report), {

        background: backgroundHeaderImage,

        header: defaultHeader(report),

        content: [
            defaultContentHeader(report, backgroundHeaderImage),
            guardArrivalText(),
            pdfUtils.tableBorderedWithHeader({
                widths : ['*', 50, '*', '*', '*'],
                header : ['Hændelse', 'Antal', 'Personer', 'Placering', 'Bemærkninger'],
                content: _.zip(contentMap.eventName, contentMap.amount, contentMap.people, contentMap.location, contentMap.remarks)
            })
        ],

        footer: defaultFooter(report),


        styles: pdfUtils.defaultStyles()

    });
};

/**
 * Generate static report doc definition
 *
 * @param report
 * @param settings
 */
var staticReportDefinition = function (report, settings) {

    var contentMap = reportUtils.reportEventsMap(report, timeZone);


    console.log('!!');
    console.log(JSON.stringify(defaultHeader(report)));



    return _.extend(defaultDoc(report), {

        background: defaultBackgroundHeaderImage(settings),

        header: defaultHeader(report),

        content: [
            defaultContentHeader(report),
            pdfUtils.tableNoBorders({
                widths: [50, '*'],
                content: _.zip(contentMap.timestamps, contentMap.remarks)
            })
        ],

        footer: defaultFooter(report),


        styles: pdfUtils.defaultStyles()

    });
};
