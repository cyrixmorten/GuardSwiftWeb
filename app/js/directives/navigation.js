'use strict';

/* Directives */

var myApp = angular.module('GuardSwiftApp.directives');

myApp.directive('gsNavbarLoggedIn', function() {
	return {
		restrict : "E",
		transclude : true,
		templateUrl : 'views/navigation/navbar_logged_in.html'
	};
});

myApp.directive('gsLinkButton', function() {
	return {
		restrict : "E",
		templateUrl : 'views/button/linkbutton.html',
		scope : {
			type : "@",
			size : "@",
			link : "@",
			target : "@?",
			buttonText : "@?",
			faLeft : "@?",
			faRight : "@?",
		}	
	};
});
