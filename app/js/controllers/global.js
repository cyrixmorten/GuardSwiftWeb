'use strict';

var controllerModule = angular.module('GuardSwiftApp.controllers');

controllerModule.controller('LoginCtrl', [
		'$scope',
		'$timeout',
		'$location',
		'$route',
		'$routeSegment',
		'ParseService',
		'ParseFactory',
		function($scope, $timeout, $location, $route, $routeSegment, ParseService, ParseFactory) {

			var Account = ParseService.Account;


			$scope.login = function(user) {
				$scope.loading = true;
				$timeout(function() {
					login(user);
				}, 500);

			};
			
			var login = function(user) {
				Account.login(user.username, user.password, {
					success : function(user) {
						
						var p = ParseFactory.getAll();
						for (var key in p) {
							  if (p.hasOwnProperty(key)) {
//							    console.log(key + " -> " + p[key]);
							    var parseObject = p[key];
							    parseObject.clearStoredParseObjects();
							    parseObject.setDefaultHiddenData();
							  }
							}
						
						$location.path($routeSegment.getSegmentUrl('home'));
						$route.reload();
						
					},
					error : function(user, error) {
						alert(error.message);
						$scope.loading = false;
					}
				});
			}

		}]);

controllerModule.controller('HomeCtrl', ['$scope', function($scope) {
}]);


var publicSegments = ['report'];

controllerModule
		.controller(
				'MainCtrl',
				[
						'$rootScope',
						'$scope',
						'$location',
						'$timeout',
						'$routeSegment',
						'ParseService',
						function($scope, $rootScope, $location, $timeout, $routeSegment, ParseService) {

							var ParseAccount = ParseService.Account;
							
							$scope.$routeSegment = $routeSegment;
							
							$scope.go = function(path) {
								$location.path(path);
							};

							$scope.pathContains = function(value) {
								var path = $location.path();
								return ~path.indexOf(value);
							};
							

							$scope.logout = function() {
								ParseService.Account.logout();
								$scope.go('login');
							};
							
							// auto direct based on login status
							$rootScope.$on('routeSegmentChange', function() {

								$scope.isLoggedIn = ParseAccount.isLoggedIn();
								
//								console.log("is logged in: " + $scope.isLoggedIn);
								
								if ($scope.isLoggedIn) {
									$scope.currentUser = ParseAccount.currentUser;
									$scope.username = ParseAccount.getUsername();
								}

								
								$scope.isPublic = ~publicSegments.indexOf($routeSegment.name);
								
								if (!$scope.isPublic) {
									if (!$routeSegment.contains('login')
											&& !$scope.isLoggedIn) {
										$scope.go('login');
									}
									if ($routeSegment.contains('login')
											&& $scope.isLoggedIn) {
										$scope.go('home');
									}
								}
							});



						}]);

