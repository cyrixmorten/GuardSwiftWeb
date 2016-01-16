'use strict';

/* Directives */

var myApp = angular.module('GuardSwiftApp.directives');

myApp.directive('gsMapSingleMarker', [function() {
	return {
		restrict : 'E',
		templateUrl : 'views/map/map_single_marker.html',
		scope : {
			position : '=',
		},
		controller: 'MapCtrl'
	}
}]).controller('MapCtrl',
		['$scope', 'uiGmapGoogleMapApi', function($scope, uiGmapGoogleMapApi) {

			uiGmapGoogleMapApi.then(function(maps) {
				updateMap();
			});
			
			$scope.$watch('position', function() {
				console.log('position changed');
				updateMap();
			})

//			$scope.$on('updateSuccess', function(event) {
//				console.log('updateSuccess');
//				updateMap();
//			});

			var updateMap = function() {
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
				};

				$scope.marker = {
					id : 'marker',
					coords : {
						latitude : $scope.position.latitude,
						longitude : $scope.position.longitude
					},
//					icon : 'assets/icon/marker_blue.png',
				};
			};

		}]);