'use strict';

var controllerModule = angular.module('GuardSwiftApp.controllers');


//controllerModule.controller('ReportCtrl', ['$scope', '$http', '$window', 'ParseEventLog', 'ParseReport', 'reportObject',
//    function ($scope, $http, $window, ParseEventLog, ParseReport, report) {
//
//        $scope.report = report;
//
//        var parseReport = ParseReport.getParseObject(report);
//
//        var openInNewTab = function(url) {
//            var win = $window.open(url, '_blank');
//            win.focus();
//        };
//
//        Parse.Cloud.run("reportToPDF", {reportId: report.id}, function (results) {
//            parseReport.fetch()
//                .then(function (report) {
//                    var pdfUrl = report.get('pdf').url();
//                    openInNewTab(pdfUrl);
//                }, function (error) {
//                    console.error(error);
//                });
//        });
//    }]);

//var owner = parseReport.get('owner');
//var staticReportSettings = owner.get('staticReportSettings');
//var headerLogo1 = staticReportSettings.get('headerLogo1');
//$scope.headerLogo1Url = headerLogo1._url;
//
//if (report.eventLogs) {
//    $scope.entries = report.eventLogs;
//}
//
//
//// backwards compatibility < 3.0.0
//if (report.reportEntries) {
//    $scope.entries = [];
//    angular.forEach(report.reportEntries, function (reportEntry) {
//        reportEntry.taskEvent = reportEntry.task_event;
//        $scope.entries.push(reportEntry);
//    });
//    $scope.entries = report.reportEntries;
//
//    // disable pdf download
//    $scope.initDownloadPDF = '';
//}


//}]);

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
