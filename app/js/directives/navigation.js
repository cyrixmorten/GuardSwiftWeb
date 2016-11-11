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

myApp.directive('gsLinkButton', ['$compile', function ($compile) {
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
            faRight: "@?",
            report: '=?'
        },
        link: function (scope, element, attrs) {

            scope.link = (scope.link) ? '#' + scope.link : undefined;

            //console.log('scope.link: ', scope.link);
            //if (scope.link) {
            //    element.children().attr('href', '#' + scope.link);
            //    $compile(element)(scope);
            //    console.log('shouldcompile');
            //}
        },
        controller: ['$scope', function ($scope) {
            $scope.getClasses = function () {
                var c = 'btn';
                if ($scope.type) {
                    c += ' ';
                    c += 'btn-' + $scope.type;
                }
                if ($scope.size) {
                    c += ' ';
                    c += 'btn-' + $scope.size;
                }
                return c;
            }
        }]
    };
}]);

// extend to handle pdf reports
myApp.directive('gsLinkButton', ['$compile', '$window', 'ParseReport', function ($compile, $window, ParseReport) {
    return {
        restrict: "E",
        //require: [
        //    '?gsLinkButton'
        //],
        terminal: true,
        link: function (scope, element, attrs) {
            // scope of extended directive
            var iScope = angular.element(element).isolateScope();

            if (iScope.report) {

                // remove link
                iScope.link = undefined;

                element.children().bind('click', function () {
                    iScope.working = true;

                    var parseReport = ParseReport.getParseObject(iScope.report);

                    var openInNewTab = function (url) {
                        var win = $window.open(url, '_blank');
                        win.focus();
                    };

                    var finish = function () {
                        _.delay(function () {
                            iScope.working = false;
                            iScope.$applyAsync();
                        }, 2000);
                    };


                    // var pdfFile = parseReport.get('pdf');
                    // if (pdfFile) {
                    //     openInNewTab(pdfFile.url());
                    //
                    //     finish();
                    // } else {
                        Parse.Cloud.run("reportToDoc", {reportId: iScope.report.id},
                            {
                                success: function (result) {
                                    console.log('result: ', result);

                                    pdfMake.createPdf(result).open();

                                    finish();
                                },
                                error: function (error) {
                                    console.log('error: ', error);

                                    finish();
                                }
                            });
                    // }
                });


                iScope.$applyAsync();
            }
        }
    }
}]);
