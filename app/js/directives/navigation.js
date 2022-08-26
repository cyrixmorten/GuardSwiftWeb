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

  
myApp.directive('gpsMapLink', function () {
    return {
        link: function (scope, element, attrs) {

            var openInNewTab = function (url) {
                var win = $window.open(url, '_blank');
                win.focus();
            };

            element.bind('click', function () {
                openInNewTab("https://coral-app-m7mls.ondigitalocean.app/auth/login&sessionToken=" + Parse.User.current().attributes['sessionToken'])
            });
        }
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
                        // create the window before the callback
                        var win = window.open('', '_blank');

                        Parse.Cloud.run("reportToDoc", {
                            reportId: iScope.report.id,
                            customerFacing: false
                            },
                            {
                                success: function (result) {

                                    result.info = {
                                        title: iScope.report.clientName + ' ' + iScope.report.clientFullAddress + ' ' + moment(iScope.report.createdAt).format('DD-MM-YYYY')
                                    }

                                    console.log(result);



                                    var options = {
                                        tableLayouts: {
                                            regularRaid: {
                                                hLineWidth(i, node) {
                                                    if (i === 0 || i === node.table.body.length) {
                                                        return 0;
                                                    }
                                                    return (i === node.table.headerRows) ? 2 : 2;
                                                },
                                                vLineWidth(i) {
                                                    return 0;
                                                },
                                                hLineColor(i) {
                                                    return 'black'
                                                },
                                                paddingLeft(i) {
                                                    return i === 0 ? 0 : 8;
                                                },
                                                paddingRight(i, node) {
                                                    return (i === node.table.widths.length - 1) ? 0 : 8;
                                                }
                                            }
                                        }
                                    }

                                    pdfMake.createPdf(result).open(options, win);
                                    //pdfMake.createPdf(result).download(iScope.report.clientName + ' ' + iScope.report.clientFullAddress + ' ' + moment(iScope.report.createdAt).format('DD-MM-YYYY'));

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
