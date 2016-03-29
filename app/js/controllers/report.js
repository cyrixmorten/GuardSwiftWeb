'use strict';

var controllerModule = angular.module('GuardSwiftApp.controllers');


controllerModule.controller('ReportCtrl', ['$scope', 'ParseEventLog', 'ParseReport', 'reportObject',
    function ($scope, ParseEventLog, ParseReport, report) {

        $scope.report = report;


        var parseReport = ParseReport.getParseObject(report);

        var owner = parseReport.get('owner');
        var staticReportSettings = owner.get('staticReportSettings');
        var headerLogo1 = staticReportSettings.get('headerLogo1');
        $scope.headerLogo1Url = headerLogo1._url;

        if (report.eventLogs) {
            $scope.entries = report.eventLogs;
        }

        $scope.initDownloadPDF = function () {

            var client = {
                name: report.clientName,
                address: report.clientAddress + ' ' + report.clientAddressNumber,
            };

            var guard = {
                id: report.guardId,
                name: report.guardName
            };

            var reportentries = _.where(report.eventLogs, {taskEvent: 'OTHER'});

            var timestamps = _.map(reportentries, function(entry) {
                return moment(entry.deviceTimestamp).format('MM:SS')
            });

            var remarks = _.map(reportentries, 'remarks');

            var docDefinition = {
                pageMargins: [40, 60, 40, 60],

                header:
                {
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
                            {text: client.name, style: 'header'}, ' ', { text: client.address, style: ['header', 'subHeader']}
                        ],
                        margin: [0,0,0,40]
                    },
                    {
                        table: {
                            headerRows: 0,
                            body: _.zip(timestamps, remarks)
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


            // open the PDF in a new window
            pdfMake.createPdf(docDefinition).open();


        };

        // backwards compatibility < 3.0.0
        if (report.reportEntries) {
            $scope.entries = [];
            angular.forEach(report.reportEntries, function (reportEntry) {
                reportEntry.taskEvent = reportEntry.task_event;
                $scope.entries.push(reportEntry);
            });
            $scope.entries = report.reportEntries;

            // disable pdf download
            $scope.initDownloadPDF = '';
        }


    }]);

controllerModule.controller('AlarmReportCtrl', ['$scope', 'scopedAlarm',
    function ($scope, scopedAlarm) {

        var report = scopedAlarm.report;

        $scope.securityLevel = scopedAlarm.securityLevel;

        $scope.timeReactionMinutes = moment(scopedAlarm.timeStarted).diff(moment(scopedAlarm.timeStartedDriving), 'minutes');
        $scope.timeTotalMinutes = moment(scopedAlarm.timeEnded).diff(moment(scopedAlarm.timeStartedDriving), 'minutes');
        ;

        console.log(scopedAlarm.timeStartedDriving);
        console.log(scopedAlarm.timeEnded);
        console.log($scope.timeReactionMinutes);
        console.log($scope.timeTotalMinutes);


        $scope.report = report.report;
        $scope.internal = report.internal;

        var installer = scopedAlarm.installer_company;
        if (installer) {
            $scope.installer = {
                name: scopedAlarm.installer_company.get("name"),
                logoUrl: scopedAlarm.installer_company.get("logoUrl")

            }
            console.log($scope.installer);
        } else {
            console.log("installer not found");
        }

        var in_cooporation_with = true
        if (in_cooporation_with) {
            $scope.cooporation = {
                name: "Sikringsvagten",
                logoUrl: "http://guardswift.com/logo/sikringsvagten.png"
            }
        }

    }]);
