//'use strict';
//
///* Controllers */
//
//var controllerModule = angular.module('GuardSwiftApp.controllers');
//
//controllerModule.controller('DetailsCtrl', function() {
//
//});
//
//controllerModule
//		.controller(
//				'ClientDetailsCtrl',
//				[
//						'$scope',
//						'ParseClient',
//						'ParseClientContact',
//						'ParseClientLocation',
//						'ParseMessage',
//						'scopedClientFromId',
//						function($scope, ParseClient, ParseClientContact, ParseClientLocation, ParseMessage, scopedClientFromId) {
//
//							// Data
//							$scope.ParseClient = ParseClient;
//							$scope.client = scopedClientFromId.object;
//							$scope.scopedClient = scopedClientFromId.scopedObject;
//
//							// Contacts
//							$scope.ParseClientContact = ParseClientContact;
//							ParseClientContact.setConfiguration({
//								toArray : {
//									arrayHolder : $scope.client,
//									arrayName : 'contacts'
//								}
//							});
//							var contacts = $scope.scopedClient.contacts;
//							$scope.scopedClientContacts = ParseClientContact
//									.getScopeFriendlyObjects(contacts);
//
//							// Rooms and Checkpoints
//							ParseClientLocation.setConfiguration({
//								toArray : {
//									arrayHolder : $scope.client,
//									arrayName : 'roomLocations'
//								}
//							});
//							$scope.ParseClientLocation = ParseClientLocation;
//							var locations = $scope.scopedClient.roomLocations;
//							$scope.scopedClientLocations = ParseClientLocation
//									.getScopeFriendlyObjects(locations);
//
//							// Internal information
//							ParseMessage.setConfiguration({
//								toArray : {
//									arrayHolder : $scope.client,
//									arrayName : 'messages'
//								}
//							});
//							$scope.ParseMessage = ParseMessage;
//							var messages = $scope.scopedClient.messages;
//							$scope.scopedMessages = ParseMessage
//									.getScopeFriendlyObjects(messages);
//						}]);
//
//controllerModule.controller('ClientDataCtrl', ['$scope', 'uiGmapGoogleMapApi',
//		function($scope, uiGmapGoogleMapApi) {
//
//			$scope.init($scope.ParseClient, [$scope.scopedClient]);
//
//			uiGmapGoogleMapApi.then(function(maps) {
//				updateMap();
//			});
//
//			$scope.$on('crud-saved', function(event, scopedCrudObject) {
//				$scope.scopedClient = scopedCrudObject;
//				updateMap();
//
//			});
//
//			var updateMap = function() {
//				$scope.position = $scope.scopedClient.position;
//
//				$scope.map = {
//					center : {
//						latitude : $scope.position.latitude,
//						longitude : $scope.position.longitude
//					},
//					zoom : 16,
//				};
//
//				$scope.positionMarker = {
//					id : 'client',
//					coords : {
//						latitude : $scope.position.latitude,
//						longitude : $scope.position.longitude
//					},
//					icon : 'assets/icon/marker_blue.png',
//				};
//			};
//
//		}]);
//
//controllerModule.controller('ClientContactsCtrl', [
//		'$scope',
//		'TableParams',
//		'$routeSegment',
//		function($scope, TableParams, $routeSegment) {
//
//			var table = TableParams.StandardTable({
//				page : 1, // show
//				// first
//				// page
//				count : 10, // count
//				// per
//				// page
//				sorting : {
//					name : 'asc'
//				}
//			});
//
//			$scope.tableParams = table.getParams();
//
//			$scope.init($scope.ParseClientContact, $scope.scopedClientContacts,
//					table, $scope.tableParams);
//
//		}]);
//
//controllerModule.controller('ClientLocationsCtrl', [
//		'$scope',
//		'TableParams',
//		function($scope, TableParams) {
//
//			var table = TableParams.StandardTable({
//				page : 1, // show
//				// first
//				// page
//				count : 10, // count
//				// per
//				// page
//				sorting : {
//					location : 'asc'
//				}
//			});
//
//			$scope.tableParams = table.getParams();
//
//			$scope.init($scope.ParseClientLocation,
//					$scope.scopedClientLocations, table, $scope.tableParams);
//
//		}]);
//
//controllerModule.controller('ClientMessagesCtrl', [
//		'$scope',
//		'TableParams',
//		function($scope, TableParams) {
//
//			var table = TableParams.StandardTable({
//				page : 1, // show
//				// first
//				// page
//				count : 10, // count
//			});
//			$scope.tableParams = table.getParams();
//
//			$scope.init($scope.ParseMessage, $scope.scopedMessages, table,
//					$scope.tableParams);
//
//		}]);
//
//controllerModule.controller('CircuitUnitDetailsCtrl', ['$scope', 'ParseCircuitUnit', 'scopedCircuitUnitFromId', 
//		function($scope, ParseCircuitUnit, scopedCircuitUnitFromId) {
//
//				$scope.ParseCircuitUnit = ParseCircuitUnit;
//				$scope.circuitUnit = scopedCircuitUnitFromId.object;
//				$scope.scopedCircuitUnit = scopedCircuitUnitFromId.scopedObject;
//	
//		}]);
//
//controllerModule.controller('CircuitUnitDescriptionCtrl',
//		[
//				'$scope',
//				function($scope) {
//
//					$scope.init($scope.ParseCircuitUnit, [$scope.scopedCircuitUnit]);
//
//					$scope.richText = {
//						customMenu : [
//								['bold', 'italic', 'underline',
//										'strikethrough'],
//								['font'],
//								['font-size'],
//								['font-color', 'hilite-color'],
//								['remove-format'],
//								['ordered-list', 'unordered-list', 'outdent',
//										'indent'],
//								['left-justify', 'center-justify',
//										'right-justify'],
//								['quote', 'paragragh'],
//								[]]
//					};
//					
//
//				}]);
//
//controllerModule.controller('CircuitUnitMessagesCtrl', ['$scope',
//		'TableParams', function($scope, TableParams) {
//
//			// var table = TableParams.StandardTable({
//			// page : 1, // show
//			// // first
//			// // page
//			// count : 10, // count
//			// });
//			// $scope.tableParams = table.getParams();
//			//
//			// $scope.init($scope.ParseMessage, $scope.scopedMessages, table,
//			// $scope.tableParams);
//
//		}]);
