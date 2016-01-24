'use strict';

var controllerModule = angular.module('GuardSwiftApp.controllers');


controllerModule.controller('ReportCtrl', ['$scope', 'ParseEventLog', 'ParseReport', 'reportObject',
		function($scope, ParseEventLog, ParseReport, reportObject) {

			$scope.report = reportObject;


			var parseReport = ParseReport.getParseObject(reportObject);

			var owner = parseReport.get('owner');
			var staticReportSettings = owner.get('staticReportSettings');
			var headerLogo1 = staticReportSettings.get('headerLogo1');
			$scope.headerLogo1Url = headerLogo1._url;

			if (reportObject.eventLogs) {
				$scope.entries = reportObject.eventLogs;
			}

			// backwards compatibility < 3.0.0
			if (reportObject.reportEntries) {
				$scope.entries = [];
				angular.forEach(reportObject.reportEntries, function(reportEntry) {
					reportEntry.taskEvent = reportEntry.task_event;
					$scope.entries.push(reportEntry);
				});
				$scope.entries = reportObject.reportEntries;
			}

			console.log(reportObject);


		}]);

controllerModule.controller('AlarmReportCtrl', ['$scope', 'scopedAlarm',
		function($scope, scopedAlarm) {

			var report = scopedAlarm.report;

			$scope.securityLevel = scopedAlarm.securityLevel;

			$scope.timeReactionMinutes = moment(scopedAlarm.timeStarted).diff(moment(scopedAlarm.timeStartedDriving), 'minutes');
			$scope.timeTotalMinutes = moment(scopedAlarm.timeEnded).diff(moment(scopedAlarm.timeStartedDriving), 'minutes');;

			console.log(scopedAlarm.timeStartedDriving);
			console.log(scopedAlarm.timeEnded);
			console.log($scope.timeReactionMinutes);
			console.log($scope.timeTotalMinutes);


			$scope.report = report.report;
			$scope.internal = report.internal;

			var installer = scopedAlarm.installer_company;
			if (installer) {
				$scope.installer = {
					name : scopedAlarm.installer_company.get("name"),
					logoUrl : scopedAlarm.installer_company.get("logoUrl")

				}
				console.log($scope.installer);
			} else {
				console.log("installer not found");
			}

			var in_cooporation_with = true
			if (in_cooporation_with) {
				$scope.cooporation = {
					name : "Sikringsvagten",
					logoUrl : "http://guardswift.com/logo/sikringsvagten.png"
				}
			}

		}]);
