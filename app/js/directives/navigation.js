'use strict';

/* Directives */

var myApp = angular.module('GuardSwiftApp.directives');

myApp.directive('gsNavbarLoggedIn', function () {
    return {
        restrict: "E",
        transclude: true,
        templateUrl: 'views/navigation/navbar_logged_in.html'
    };
});

myApp.directive('gsLinkButton', function () {
    return {
        restrict: "E",
        templateUrl: 'views/navigation/linkbutton.html',
        scope: {
            type: "@",
            size: "@",
            link: "@",
            target: "@?",
            buttonText: "@?",
            faLeft: "@?",
            faRight: "@?"
        },
        link: function (scope, element, attrs) {
            if (scope.link) {
                element.children().attr('href', '#'+scope.link);
                $compile(element)(scope);
            }
        }
    };
});
