//'use strict';
//
//var controllerModule = angular.module('GuardSwiftApp.controllers');
//
//controllerModule
//		.controller(
//				'CircuitCtrl',
//				[
//						'$scope',
//						'TableParams',
//						'ParseCircuit',
//						'scopedCircuits',
//						'timeStrings',
//						function($scope, TableParams, ParseCircuit, scopedCircuits, timeStrings) {
//
//							var table = TableParams.StandardTable();
//							var tableParams = table.getParams();
//
//							$scope.init(ParseCircuit, scopedCircuits, table,
//									tableParams);
//							
//
//							$scope.hours = timeStrings.hours;
//							$scope.days = timeStrings.days;
//							
//
//						}]);
//
//controllerModule.controller('CircuitSelectCtrl', ['$scope', 'translations',
//		'clients', 'scopedCircuits',
//		function($scope, translations, clients, scopedCircuits) {
//
//			// $routeSegment.getSegmentUrl('s1');
//			$scope.parentUrl = '#/plan/circuits';
//			$scope.childUrl = '#/plan/circuitunits/';
//
//			$scope.clients = clients;
//			$scope.scopedParentObjects = scopedCircuits;
//
//			$scope.translations = translations;
//
//		}]);
//
//controllerModule
//		.controller(
//				'CircuitUnitCtrl',
//				[
//						'$scope',
//						'$translate',
//						'TableParams',
//						'ParseCircuitUnit',
//						'selectedCircuit',
//						'scopedCircuitUnits',
//						'timeStrings',
//						function($scope, $translate, TableParams, ParseCircuitUnit, selectedCircuit, scopedCircuitUnits, timeStrings) {
//
//							var table = TableParams.StandardTable();
//							var tableParams = table.getParams();
//
//							
//							$scope.init(ParseCircuitUnit, scopedCircuitUnits,
//									table, tableParams);
//
//							$scope.circuit = selectedCircuit.scopedObject;
//							$scope.days = timeStrings.days;
//
//							$translate(['HIGH', 'LOW']).then(
//									function(translations) {
//										$scope.translations = translations;
//									});
//
//							$scope.translatePriority = function(priority) {
//								return (priority)
//										? $scope.translations.HIGH
//										: $scope.translations.LOW;
//							};
//
//						}]);
//
//controllerModule
//		.controller(
//				'DistrictWatchCtrl',
//				[
//						'$scope',
//						'TableParams',
//						'ParseDistrictWatch',
//						'scopedDistrictWatches',
//						'timeStrings',
//						function($scope, TableParams, ParseDistrictWatch, scopedDistrictWatches, timeStrings) {
//
//							var table = TableParams.StandardTable();
//							var tableParams = table.getParams();
//
//							$scope.init(ParseDistrictWatch,
//									scopedDistrictWatches, table, tableParams);
//
//							// $scope.createData =
//							// ParseDistrictWatch.getTemplate();
//
//							$scope.hours = timeStrings.hours;
//							$scope.days = timeStrings.days;
//
//						}]);
//
//controllerModule.controller('DistrictWatchSelectCtrl', ['$scope',
//		'translations', 'clients', 'scopedDistrictWatches',
//		function($scope, translations, clients, scopedDistrictWatchUnits) {
//
//			// $routeSegment.getSegmentUrl('s1');
//			$scope.parentUrl = '#/plan/districtwatch/';
//			$scope.childUrl = '#/plan/districtwatchunits/';
//
//			$scope.clients = clients;
//			$scope.scopedParentObjects = scopedDistrictWatchUnits;
//
//			$scope.translations = translations;
//
//		}]);
//
//controllerModule
//		.controller(
//				'DistrictWatchUnitCtrl',
//				[
//						'$scope',
//						'TableParams',
//						'ParseDistrictWatchUnit',
//						'selectedDistrictWatch',
//						'scopedDistrictWatchUnits',
//						'timeStrings',
//						function($scope, TableParams, ParseDistrictWatchUnit, selectedDistrictWatch, scopedDistrictWatchUnits, timeStrings) {
//
//							var table = TableParams.StandardTable();
//							var tableParams = table.getParams();
//
//							$scope.init(ParseDistrictWatchUnit,
//									scopedDistrictWatchUnits, table,
//									tableParams);
//
//							$scope.districtWatch = selectedDistrictWatch.scopedObject;
//							$scope.days = timeStrings.days;
//
//							$scope.clientSelected = function(client) {
//								if (client) {
//									$scope.createData.address = client.get("addressName");
//									
//									// http://stackoverflow.com/questions/15590140/ng-list-input-not-updating-when-adding-items-to-array
//									var addressNumbers = [];
//									addressNumbers.push(client.get("addressNumber"));
//									$scope.createData.addressNumbers = addressNumbers;									
//								}
//							}
//						}]);
//
//controllerModule
//		.controller(
//				'ChecklistCircuitStartCtrl',
//				[
//						'$scope',
//						'TableParams',
//						'ParseChecklistStart',
//						'scopedChecklistStarts',
//						function($scope, TableParams, ParseChecklistStart, scopedChecklistStarts) {
//
//							var table = TableParams.StandardTable();
//							$scope.tableParams = table.getParams();
//
//							$scope.init(ParseChecklistStart,
//									scopedChecklistStarts, table,
//									$scope.tableParams);
//
//						}]);
//
//controllerModule.controller('ChecklistCircuitEndCtrl', [
//		'$scope',
//		'TableParams',
//		'ParseChecklistEnd',
//		'scopedChecklistEnds',
//		function($scope, TableParams, ParseChecklistEnd, scopedChecklistEnds) {
//
//			var table = TableParams.StandardTable();
//			$scope.tableParams = table.getParams();
//
//			$scope.init(ParseChecklistEnd, scopedChecklistEnds, table,
//					$scope.tableParams);
//
//		}]);
