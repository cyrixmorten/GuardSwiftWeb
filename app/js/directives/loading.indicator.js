'use strict';

/* Directives */

var myApp = angular.module('GuardSwiftApp.directives');


myApp.directive('loaderHorizontalSmall', [function() {
	return {
		restrict : 'EA',
		transclude : true,
		templateUrl : 'views/loading/smallHorizontal.html'
	};
}]);

myApp.directive('loaderCircleSmall', [function() {
	return {
		restrict : 'EA',
		transclude : true,
		template : '<IMG class="img-responsive center-block" ng-src="assets/icon/small-loader.gif"></IMG>'
	};
}]);

myApp.directive('loaderSpinningSquares', [function() {
	return {
		restrict : 'EA',
		transclude : true,
		templateUrl : 'views/loading/spinningSquares.html'
	};
}]);

myApp.directive('panelLoader', [function() {
	return {
		restrict : 'EA',
		transclude : true,
		template : '<div class="pull-right" ng-if="performingUpdate"><IMG ng-src="assets/icon/small-loader.gif"></IMG></div>'
	};
}]);

myApp.directive('sgLoading', function() {
	return {
		restrict : 'E',
		templateUrl : 'views/loading.html'
	};
});

