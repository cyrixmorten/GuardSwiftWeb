'use strict';

/* Controllers */

var controllerModule = angular.module('GuardSwiftApp.controllers');

controllerModule.controller('ConfirmActionModalCtrl', function ($scope, $modalInstance, itemType, itemName) {

      $scope.itemType = itemType.toLowerCase();	
	  $scope.itemName = itemName;
	  
	  $scope.ok = function () {
	    $modalInstance.close();
	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
	});

controllerModule
		.controller(
				'EventlogDetailsDialogCtrl',
				[
						'$scope',
						'$modalInstance',
						'eventLog',
						'uiGmapIsReady',
						function($scope, $modalInstance, eventLog, uiGmapIsReady) {

							console.log('EventLogDetails');
							console.log(eventLog);

							$scope.close = function() {
								$modalInstance.dismiss('close');
							};

							// get object from the factory
							$scope.map = {
								center : {
									latitude : 55.56088099999999,
									longitude : 9.784047
								},
								zoom : 16,
								bounds : {},
								control : {},
							};

							$scope.eventlog = eventLog;

							$scope.title = eventLog.event;
							if (eventLog.clientName) {
								$scope.title += " " + eventLog.clientName;
							}

							var position = eventLog.position;
							if (position) {
								$scope.map.center = {
									latitude : position.latitude,
									longitude : position.longitude
								};

								$scope.positionMarker = {
									id : 'guard',
									coords : {
										latitude : $scope.map.center.latitude,
										longitude : $scope.map.center.longitude
									},
									icon : 'assets/icon/marker_green.png'
								};
							}

							var client = eventLog.client;
							$scope.client = client;
							if (client) {
								console.log('creating client marker');
								$scope.address = client.get('fullAddress');
								$scope.zipcode = client.get('zipcode');
								$scope.cityName = client.get('cityName');
								$scope.city = $scope.zipcode + " "
										+ $scope.cityName;

								var position = client.get('position');
								$scope.targetMarker = {
									id : 'client',
									coords : {
										latitude : position.latitude,
										longitude : position.longitude
									},
									icon : 'assets/icon/marker_blue.png'
								};

							}

							var taskGroupStarted = eventLog.taskGroupStarted;
							$scope.taskGroupStarted = taskGroupStarted;
							if (taskGroupStarted) {
								taskGroupStarted.name = taskGroupStarted
										.get('name');
							}

							var task = eventLog.task;
							$scope.task = task;
							if (task) {
								task.name = task.get('name');
								task.timeStart = task
										.get('timeStart');
								task.timeEnd = task
										.get('timeEnd');
							}

							if ($scope.targetMarker || $scope.positionMarker) {
								$scope.showMap = true;
							}

							uiGmapIsReady
									.promise(1)
									.then(
											function(instances) {

												$scope.map.options = {
													mapTypeId : google.maps.MapTypeId.HYBRID
												};

												var targetMarker = $scope.targetMarker;
												var positionMarker = $scope.positionMarker;
												if (positionMarker
														&& targetMarker) {
													var positionCoords = $scope.positionMarker.coords;
													var targetCoords = $scope.targetMarker.coords;
													var positionLatLng = new google.maps.LatLng(
															positionCoords.latitude,
															positionCoords.longitude);
													var targetLatLng = new google.maps.LatLng(
															targetCoords.latitude,
															targetCoords.longitude);

													$scope.distance = Math
															.round(google.maps.geometry.spherical
																	.computeDistanceBetween(
																			positionLatLng,
																			targetLatLng));

													var northeast = targetCoords;
													var southwest = positionCoords;
													if (positionCoords.longitude >= targetCoords.longitude) {
														northeast = positionCoords;
														southwest = targetCoords;
													}
													var bounds = {
														northeast : northeast,
														southwest : southwest
													};
													$scope.map.bounds = bounds;
													console.log("bounds set");
													console.log(bounds);

												} else if (targetMarker) {
													$scope.map.center = {
														latitude : targetMarker.latitude,
														longitude : targetMarker.longitude
													};
												} 
											});

						}]);

controllerModule.controller('EventlogSummaryDialogCtrl', [
		'$scope',
		'$modalInstance',
		'eventLog',
		'uiGmapIsReady',
		function($scope, $modalInstance, eventLog, uiGmapIsReady) {

			console.log('SummaryDialog');

			var eventLog = eventLog.scopedObject;

			var gpsSummary = eventLog.gpsSummary;

			console.log(eventLog);
			console.log(gpsSummary);

			$scope.close = function() {
				$modalInstance.dismiss('close');
			};

			$scope.map = {
				zoom : 17
			};

			$scope.eventlog = eventLog;

			$scope.title = eventLog.event;
			if (eventLog.clientName) {
				$scope.title += " " + eventLog.clientName;
			}

			var client = eventLog.client;
			$scope.client = client;
			if (client) {

				$scope.address = client.get('fullAddress');
				$scope.zipcode = client.get('zipcode');
				$scope.cityName = client.get('cityName');
				$scope.city = $scope.zipcode + " " + $scope.cityName;

				var position = client.get('position');
				var clientCoords = {
					latitude : position.latitude,
					longitude : position.longitude
				};
				$scope.targetMarker = {
					id : 'client',
					coords : clientCoords,
					icon : 'assets/icon/marker_blue.png',
					options : {
						zIndex : 99999999
					}
				};

				$scope.geofence = {
					id : 1,
					center : {
						latitude : 44,
						longitude : -108
					},
					radius : 50,
					stroke : {
						color : '#08B21F',
						weight : 2,
						opacity : 1
					},
					fill : {
						color : '#08B21F',
						opacity : 0.3
					},
					geodesic : false, // optional: defaults to false
					draggable : false, // optional: defaults to false
					clickable : false, // optional: defaults to true
					editable : false, // optional: defaults to false
					visible : false, // optional: defaults to true
					control : {}
				};
			}

			uiGmapIsReady.promise(1).then(
					function(instances) {
						console.log('map ready');

						// $scope.map.options = {mapTypeId:
						// google.maps.MapTypeId.SATELLITE },

						$("#my-map .angular-google-map-container").height(400);
						if ($scope.targetMarker) {
							$scope.map.center = angular
									.copy($scope.targetMarker.coords);
						}
						$scope.$broadcast('loadGPSData', {
							object : eventLog,
							gpsData : gpsSummary,
							fit : true
						});
					});

		}]);
