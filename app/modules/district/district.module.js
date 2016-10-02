angular.module('GSDistrict', [
    'GSConstants',
    // 'chart.js',
    // 'angularPayments',
    'ngRoute',
    'route-segment',
    // 'view-segment',
    'ngTable',
    // 'uiGmapgoogle-maps',
    // 'cgBusy',
    // 'focusOn',
    // 'ui-notification',
    // 'wysiwyg.module',
    // 'angular-ladda',
    'GuardSwiftApp.filters',
    'GuardSwiftApp.services',
    'GuardSwiftApp.directives',
    'GuardSwiftApp.controllers'
]).config(['$routeSegmentProvider', function ($routeSegmentProvider) {

    $routeSegmentProvider.
        when('/plan/group/district', 'districtGroups').
        when('/plan/task/district/:taskGroup', 'districtTasks')

}])
.config(['$routeSegmentProvider', 'smallHorizontalLoader', function ($routeSegmentProvider, smallHorizontalLoader) {

    $routeSegmentProvider.
        segment('districtGroups', {
            templateUrl: 'modules/district/district.groups.html',
            controller: 'StandardCRUDCtrl',
            resolve: {
                ParseObject: function (DistrictGroup) {
                    return DistrictGroup;
                },
                scopedDistrictWatches: function (DistrictGroup) {
                    return DistrictGroup.fetchAll(); // load objects before showing the partial
                }
            }
            , untilResolved: {
                templateUrl: smallHorizontalLoader
            }
        })
        .segment('districtTasks', {
            templateUrl: 'modules/district/district.tasks.html',
            dependencies: ['taskGroup'], // id to group
            controller: 'StandardCRUDCtrl',
            resolve: {
                ParseObject: ['DistrictGroup', 'DistrictTask', function (DistrictTaskGroup, DistrictTask) {
                    var pointer = DistrictTaskGroup.getPointerObjectFromRouteParamId('taskGroup');
                    console.log('pointer: ', pointer);
                    DistrictTask.addHiddenData({
                        taskGroup: pointer
                    });

                    return DistrictTask;
                }],
                scopedObjects: ['DistrictGroup', 'DistrictTask', function (DistrictTaskGroup, DistrictTask) {
                    var pointer = DistrictTaskGroup.getPointerObjectFromRouteParamId('taskGroup');
                    var query = DistrictTask.getQuery(pointer);
                    return DistrictTask.fetchAll(query); // load objects before showing the partial
                }]
            }
            , untilResolved: {
                templateUrl: smallHorizontalLoader
            }
        })
}]);