//'use strict';
//
/* Controllers */
//
//var controllerModule = angular.module('GuardSwiftApp.controllers');
//
//
//controllerModule.controller('AlarmGroupCtrl', ['$scope', 'TableParams', 'ParseService',
//		'ParseAlarmGroup', 'scopedAlarmGroups',
//		function($scope, TableParams, ParseService, ParseAlarmGroup, scopedAlarmGroups) {
//
//			var table = TableParams.StandardTable({
//				page : 1,
//				count : 100,
//				sorting : {
//					name : 'asc'
//				}
//			});
//			
//			$scope.broadcast_alarms = ParseService.Account.getSettings().broadcast_alarms;
//			$scope.tableParams = table.getParams();
//
//			$scope.init(ParseAlarmGroup, scopedAlarmGroups, table, $scope.tableParams);
//
//		}]);
//
//controllerModule.controller('ClientCtrl', ['$scope', 'TableParams',
//		'ParseClient', 'scopedClients',
//		function($scope, TableParams, ParseClient, scopedClients) {
//
//			var table = TableParams.StandardTable({
//				page : 1, // show
//				// first
//				// page
//				count : 100, // count
//				// per
//				// page
//				sorting : {
//					number : 'desc'
//				}
//			});
//			$scope.tableParams = table.getParams();
//
//			$scope.init(ParseClient, scopedClients, table, $scope.tableParams);
//
//		}]);
//
//controllerModule.controller('EventTypeCtrl', [
//		'$scope',
//		'TableParams',
//		'ParseEventType',
//		'scopedEventTypes',
//		function($scope, TableParams, ParseEventType, scopedEventTypes) {
//
//			var table = TableParams.StandardTable({
//				page : 1,
//				count : 100,
//				sorting : {
//					name : 'asc'
//				}
//			});
//			$scope.tableParams = table.getParams();
//
//			$scope.init(ParseEventType, scopedEventTypes, table,
//					$scope.tableParams);
//
//		}]);
//
// controllerModule.controller('ClientInfoCtrl', [
// '$scope',
// 'TableParams',
// 'ParseClientInfo',
// 'scopedClientInfos',
// function($scope, TableParams, ParseClientInfo, scopedClientInfos) {
//
// var table = TableParams.StandardTable({
// page : 1, // show
// // first
// // page
// count : 10, // count
// });
// $scope.tableParams = table.getParams();
//
// $scope.init(ParseClientInfo, scopedClientInfos, table,
// $scope.tableParams);
//
// }]);

// controllerModule.controller('ClientContactsCtrl', [
// '$scope',
// 'TableParams',
// 'ClientContact',
// 'scopedClientAndContacts',
// function($scope, TableParams, ClientContact, scopedClientAndContacts) {
//
// console.log(scopedClientAndContacts);
//			
// $scope.client = scopedClientAndContacts.scopedClient;
//
// var table = TableParams.StandardTable({
// page : 1, // show
// // first
// // page
// count : 10, // count
// // per
// // page
// sorting : {
// name : 'desc'
// }
// });
// $scope.tableParams = table.getParams();
//
// $scope.init(ClientContact, scopedClientAndContacts.scopedContacts,
// table, $scope.tableParams);
//
// }]);

// controllerModule.controller('ClientLocationsCtrl', [
// '$scope',
// 'TableParams',
// 'ClientContact',
// 'scopedClientContact',
// function($scope, TableParams, ClientContact, scopedClientAndContacts) {
//
// $scope.client = scopedClientAndContacts.scopedClient;
//
// var table = TableParams.StandardTable({
// page : 1, // show
// // first
// // page
// count : 10, // count
// // per
// // page
// sorting : {
// name : 'desc'
// }
// });
// $scope.tableParams = table.getParams();
//
// $scope.init(ClientContact, scopedClientAndContacts.scopedContacts,
// table, $scope.tableParams);
//
// }]);
