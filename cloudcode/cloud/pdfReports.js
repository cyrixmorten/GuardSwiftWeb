var moment = require('cloud/lib/moment/moment.min.js');
var _ = require('cloud/lib/underscore.js');


Parse.Cloud.define("generatePDFReport", function (request, response) {
    Parse.Cloud.useMasterKey();

    if (!request.params.reportId) {
        response.error('missing reportId');
        return;
    }

    var query = new Parse.Query("Report");
    query.equalTo('objectId', request.params.reportId);
    query.include('client');
    query.include('eventLogs');
    query.first().then(function(report) {

        return Parse.Cloud.httpRequest({
            method: 'POST',
            url: 'http://www.guardswift.com/api/pdfmake',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: createDocDefinition(report)
        }).then(function (httpResponse) {

            var file = new Parse.File("report.pdf", {
                base64: httpResponse.buffer.toString('base64', 0, httpResponse.buffer.length)
            }, 'application/pdf');

            return file.save().then(function () {

                report.set("pdf", file);

                return report.save();
            }).then(function (report) {
                response.success(httpResponse);
            })
        }, function (error) {
            console.error(error);
            response.error(error);
        });

    }).fail(function (err) {
        console.error(err);
        response.error(err.message);
    });

});

var createDocDefinition = function (report) {

    var client = {
        name: report.get('clientName'),
        address: report.get('clientAddress') + ' ' + report.get('clientAddressNumber'),
    };

    var guard = {
        id: report.get('guardId'),
        name: report.get('guardName')
    };

    var reportEntries = _.filter(report.get('eventLogs'), function(eventLog) {
        return eventLog.get('task_event') === 'OTHER';
    });

    var timestamps = _.map(reportEntries, function (entry) {
        return moment(entry.get('deviceTimestamp')).format('MM:SS');
    });

    var remarks = _.map(reportEntries, function(entry) {
        return entry.get('remarks');
    });

    var reportContent = _.zip(timestamps, remarks);

    var docDefinition = {
        pageMargins: [40, 60, 40, 60],

        header: {
            columns: [
                {
                    width: 'auto',
                    text: [
                        {text: 'Vagt: ', bold: true}, guard.name + ' ' + guard.id
                    ]
                },
                {
                    width: '*',
                    text: 'Dato: ' + moment(report.deviceTimestamp).format('DD-MM-YYYY'),
                    alignment: 'right'
                }
            ],
            margin: [10, 10]
        },

        content: [
            {
                text: [
                    {text: client.name, style: 'header'}, ' ', {text: client.address, style: ['header', 'subHeader']}
                ],
                margin: [0, 0, 0, 40]
            },
            {
                table: {
                    headerRows: 0,
                    body: _.isEmpty(reportContent) ? [[]] : reportContent
                },
                layout: 'noBorders',
                margin: [0, 30]
            }
        ],

        footer: [
            {text: 'YDERLIGERE OPLYSNINGER PÅ TLF. 86 16 46 44', alignment: 'center'},
            {
                text: 'Rapporten er genereret af GuardSwift - elektroniske vagtrapporter via smartphones',
                alignment: 'center'
            }
        ],


        styles: {
            header: {
                fontSize: 22,
                bold: true,
                alignment: 'center'
            },
            subHeader: {
                fontSize: 16,
                color: 'grey'
            }
        }

    };

    return docDefinition;

};
