'use strict';

/* Directives */

var myApp = angular.module('GuardSwiftApp.directives');

myApp.directive('gsMapSingleMarker', [function() {
	return {
		restrict : 'E',
		templateUrl : 'views/map/map_single_marker.html',
		scope : {
			position : '=',
			canUpdateMarker: '='
		},
		controller: 'MapCtrl'
	}
}]).controller('MapCtrl',
		['$scope', 'uiGmapGoogleMapApi', function($scope, uiGmapGoogleMapApi) {

				if (!$scope.position) {
					console.error('missing position');
					return;
				}
				$scope.map = {
					center : {
						latitude : $scope.position.latitude,
						longitude : $scope.position.longitude
					},
					zoom : 16,
					events : {
						rightclick: function(map, eventName, events) {
							if (!$scope.canUpdateMarker) {
								return;
							}
							var event = events[0];

							updateMarker({
								latitude: event.latLng.lat(),
								longitude: event.latLng.lng(),
							});
							
						}
					}
				};

				$scope.marker = {
					id : 'marker',
					coords : $scope.position,
					options: { draggable: $scope.canUpdateMarker },
					events: {
					  dragend: function (marker, eventName, args) {
						updateMarker({
							latitude: marker.getPosition().lat(),
							longitude: marker.getPosition().lng()
						});
					  }
					}
				};
				
				$scope.$watch('canUpdateMarker', function(newVal, oldVal) {
					if (newVal === oldVal) {
						return;
					}
					
					$scope.$applyAsync(function() {
						$scope.marker.options.draggable = newVal;
					})
				})
				
				$scope.$watch('position', function(newVal, oldVal) {
					if (newVal === oldVal) {
						return;
					}
					
					updateMarker(newVal);
				})

				var updateMarker = function(position) {
					$scope.$applyAsync(function() {
						$scope.position.latitude = position.latitude;
						$scope.position.longitude = position.longitude;
						$scope.marker.coords = position;
					})
				}

		}]);
