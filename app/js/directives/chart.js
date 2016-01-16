'use strict';

/* Directives */

var myApp = angular.module('GuardSwiftApp.directives');

myApp.directive('gsEventPieChart', [function() {
	return {
		restrict : 'E',
		template : '<canvas id="pie" class="chart chart-pie" data="data" labels="labels" legend="true"></canvas>',
		scope : {
			scopedEventLogs : '=',
		},
		controller: 'EventChartCtrl'
	}
}]).directive('gsEventBarChart', [function() {
	return {
		restrict : 'E',
		template : '<canvas id="bar" class="chart chart-bar" data="bardata" labels="barlabels" series="series"></canvas>',
		scope : {
			scopedEventLogs : '=',
		},
		controller: 'EventChartCtrl'
	}
}]).controller('EventChartCtrl', ['$scope', '$filter', function($scope, $filter) {

	$scope.$watch('scopedEventLogs', function() {

		var eventlogs = $scope.scopedEventLogs;
		
		
		$scope.labels = [];
		$scope.data = [];
		
		$scope.barlabels = [];
		$scope.bardata = [];
		
		var eventMap = {};
		angular.forEach(eventlogs, function(eventlog) {
			
			var event = eventlog.event;
			var amount = eventlog.amount;
			
			if (event in eventMap) {
				var storedAmount = eventMap[event];
				eventMap[event] = storedAmount + amount;
			} else {
				eventMap[event] = amount;
			}
		});
		
		for (var event in eventMap) {
			$scope.labels.push(event);
			$scope.barlabels.push($filter('truncate')(event));
			$scope.data.push(eventMap[event]);
		}
		
		$scope.bardata.push($scope.data);
	});

}]);