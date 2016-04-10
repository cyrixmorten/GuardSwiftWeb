var moment = require('cloud/lib/moment/moment-timezone.js');
var s = require("cloud/lib/underscore.string.min.js");
var _ = require('cloud/lib/underscore.js');

// todo store/retrieve from user
var timeZone = 'Europe/Copenhagen';

var fetchReportSettings = function (user, settingsCol) {
    return user.fetch().then(function (user) {
        return user.get(settingsCol).fetch();
    });
};


var createDocDefinition = function (report) {

    var promise = new Parse.Promise.error('No definition matching report');

    var owner = report.get('owner');

    if (report.has('circuitUnit')) {
        promise = fetchReportSettings(owner, 'regularReportSettings').then(function (settings) {
            return regularReportDefinition(report, settings);
        });
    }
    if (report.has('staticTask')) {
        promise = fetchReportSettings(owner, 'staticReportSettings').then(function (settings) {
            return staticReportDefinition(report, settings);
        });
    }

    return promise;
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
        httpResponse: {},
        documentDefinition: {}
    };

    query.first().then(function (report) {

        result.report = report;

        var pdfCreatedAt = report.get('pdfCreatedAt');
        var updatedAt = report.get('updatedAt');

        var hasPDF = pdfCreatedAt && Math.abs(moment(pdfCreatedAt).diff(moment(updatedAt), 'seconds')) < 10;

        if (hasPDF) {

            console.log('fetching pdf');

            result.createdPDF = false;

            /**
             * Save time and resources by simply returning the stored report
             */

            return Parse.Cloud.httpRequest({
                method: 'GET',
                url: report.get('pdf').url(),
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

                return promise;
            };

            /**
             *  Create a new PDF report and store it
             */


            return deletePromise(report).then(function () {
                return createDocDefinition(report);
            }).then(function (docDefinition) {

                result.documentDefinition = docDefinition;

                return Parse.Cloud.httpRequest({
                    method: 'POST',
                    url: 'http://www.guardswift.com/api/pdfmake',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: docDefinition
                })
            }).fail(function (error) {
                console.error('Error deleting report');
                console.error({
                    message: 'Error deleting report',
                    error: error,
                    documentDefinition: documentDefinition
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
                });
        }

        return promise;

    }).then(function () {

            console.log('pdf done', result);

            response.success(result);
        })
        .fail(function (error) {
            console.error(error);

            response.error({
                message: error.message,
                error: error,
                documentDefinition: documentDefinition
            });

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

    return {
        columns: [
            {
                width: 'auto',
                text: [
                    {text: 'Vagt: ', bold: true}, guard.name + ' ' + guard.id
                ]
            },
            {
                width: '*',
                text: 'Dato: ' + moment(report.get('createdAt')).tz(timeZone).format('DD-MM-YYYY'),
                alignment: 'right'
            }
        ],
        margin: [10, 10]
    }
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

    return {
        text: [
            {text: client.name, style: 'header'}, ' ', {text: client.address, style: ['header', 'subHeader']}
        ],
        margin: [50, 40 + pushTopMargin, 50, 0]
    }
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

var defaultStyles = function () {
    return {
        header: {
            fontSize: 22,
            bold: true,
            alignment: 'center'
        },
        subHeader: {
            fontSize: 16,
            color: 'grey'
        },
        tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
        },
        boldFont: {
            bold: true
        }
    };
};

/**
 * Extracts content information for given report
 *
 * @param report
 * @returns {{events_task_other: Array, timestamps: Array, eventName: Array, amount: Array, people: Array, location: Array, remarks: Array}}
 */
var reportContentMap = function (report) {

    var arrivedLogs = _.filter(report.get('eventLogs'), function (eventLog) {
        return eventLog.get('task_event') === 'ARRIVE';
    });

    var eventLogs = _.filter(report.get('eventLogs'), function (eventLog) {
        return eventLog.get('task_event') === 'OTHER';
    });

    return {
        arrivedTimestamps: _.map(arrivedLogs, function (log) {
            var timeStamp = log.get('deviceTimestamp');

            return moment(timeStamp).tz(timeZone).format('HH:mm');
        }),

        timestamps: _.map(eventLogs, function (log) {
            var timeStamp = log.get('deviceTimestamp');

            return moment(timeStamp).tz(timeZone).format('HH:mm');
        }),

        eventName: _.map(eventLogs, function (log) {
            return log.get('event') || '';
        }),

        amount: _.map(eventLogs, function (log) {
            return log.has('amount') ? log.get('amount').toString() : '';
        }),

        people: _.map(eventLogs, function (log) {
            return log.get('people') || '';
        }),

        location: _.map(eventLogs, function (log) {
            return log.get('clientLocation') || '';
        }),

        remarks: _.map(eventLogs, function (log) {
            return log.get('remarks') || '';
        })
    };
};


/**
 * Generate regular report doc definition
 *
 * @param report
 */
var regularReportDefinition = function (report, settings) {

    console.log(JSON.stringify('regularReportDefinition'));

    var contentMap = reportContentMap(report);

    var tableHeaderWidths = ['*', 50, '*', '*', '*'];
    var reportContent = _.zip(contentMap.eventName, contentMap.amount, contentMap.people, contentMap.location, contentMap.remarks);

    var contentWithHeader = function (reportContent) {
        // define header
        var tableHeaderRaw = ['Hændelse', 'Antal', 'Personer', 'Placering', 'Bemærkninger'];
        var tableHeader = [{text: tableHeaderRaw[0], style: 'tableHeader'}, {
            text: tableHeaderRaw[1],
            style: 'tableHeader'
        }, {text: tableHeaderRaw[2], style: 'tableHeader'}, {
            text: tableHeaderRaw[3],
            style: 'tableHeader'
        }, {text: tableHeaderRaw[4], style: 'tableHeader'}];

        // insert header
        reportContent.unshift(tableHeader);

        return reportContent;
    };

    var guardArrivalText = function () {
        if (_.isEmpty(contentMap.arrivedTimestamps)) {
            return '';
        }

        return {
            text: 'Vægter ankom på adressen kl: ' + contentMap.arrivedTimestamps[0],
            margin: [0, 10],
            style: 'boldFont'
        }
    };

    var backgroundHeaderImage = defaultBackgroundHeaderImage(settings);

    return _.extend(defaultDoc(report), {

        background: backgroundHeaderImage,

        header: defaultHeader(report),

        content: [
            defaultContentHeader(report, backgroundHeaderImage),
            guardArrivalText(),
            {
                table: {
                    widths: tableHeaderWidths,
                    headerRows: 1,
                    body: _.isEmpty(reportContent) ? [[]] : contentWithHeader(reportContent)
                },
                layout: {
                    hLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.body.length) ? 2 : 1;
                    },
                    vLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                    },
                    hLineColor: function (i, node) {
                        return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                    },
                    vLineColor: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                    }
                },
                margin: [0, 30]
            }
        ],

        footer: defaultFooter(report),


        styles: defaultStyles()

    });
};

/**
 * Generate static report doc definition
 *
 * @param report
 */
var staticReportDefinition = function (report, settings) {

    console.log(JSON.stringify('staticReportDefinition'));

    var contentMap = reportContentMap(report);

    var tableHeaderWidths = [50, '*'];
    var reportContent = _.zip(contentMap.timestamps, contentMap.remarks);


    var backgroundHeaderImage = defaultBackgroundHeaderImage(settings);

    return _.extend(defaultDoc(report), {

        background: backgroundHeaderImage,

        header: defaultHeader(report),

        content: [
            defaultContentHeader(report, backgroundHeaderImage),
            {
                table: {
                    widths: tableHeaderWidths,
                    headerRows: 0,
                    body: _.isEmpty(reportContent) ? [[]] : reportContent
                },
                layout: 'noBorders',
                margin: [0, 30]
            }
        ],

        footer: defaultFooter(report),


        styles: defaultStyles()

    });
};
