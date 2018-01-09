'use strict';

// Declare app level module which depends on filters, and services
angular.module('GuardSwiftApp', [
        'chart.js',
        'ngRoute',
        'route-segment',
        'view-segment',
        'ngTable',
        'picardy.fontawesome',
        'uiGmapgoogle-maps',
        'cgBusy',
        'focusOn',
        'ui-notification',
        'wysiwyg.module',
        'angular-ladda',
        'GuardSwiftApp.filters',
        'GuardSwiftApp.services',
        'GuardSwiftApp.directives',
        'GuardSwiftApp.controllers'
    ])
    .value('cgBusyDefaults', {
        message: 'Loading...',
        backdrop: true,
        delay: 0,
        minDuration: 700
    })
    .config(['$routeSegmentProvider', '$routeProvider', 'uiGmapGoogleMapApiProvider', function ($routeSegmentProvider, $routeProvider, uiGmapGoogleMapApiProvider) {

        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyA-lBins4jnAtTVkaQMPBoFGFephQSyF_k',
            v: '3.17',
            libraries: 'weather,geometry,visualization'
        });

        // Configuring provider options

        $routeSegmentProvider.options.autoLoadTemplates = true;

        var smallHorizontalLoader = 'views/loading/smallHorizontal.html';

        // Setting routes. This consists of two parts:
        // 1. `when` is similar to vanilla $route `when` but takes segment name
        // instead of params hash
        // 2. traversing through segment tree to set it up

        $routeSegmentProvider.when('/login', 'login')
        .when('/logout', 'logout')
        .when('/home', 'home')
        .when('/crud', 'crud')

        // -- Account
        .when('/account/user', 'account.user')
        .when('/account/settings', 'account.settings')
        .when('/account/purchase', 'account.purchase')


        // -- Data
        .when('/data/groups', 'groups')
        .when('/data/guards', 'guards')
        .when('/data/clients', 'clients')
        .when('/data/client/:id', 'client')
        .when('/data/client/:id/data', 'client.data') // default
        .when('/data/client/:id/contacts', 'client.contacts')
        .when('/data/client/:id/locations', 'client.locations')
        .when('/data/client/:id/messages', 'client.messages')
        .when('/data/client/:id/eventtypes', 'client.eventtypes')
        .when('/data/client/:id/history', 'client.history')
        .when('/data/client/:id/statistics', 'client.statistics')
        .when('/data/eventtypes', 'eventtypes')

        // -- Planning
        .when('/plan/taskGroups', 'taskGroups')
        .when('/plan/tasks/:taskGroupId', 'tasks') // list tasks under specific taskGroup
        .when('/plan/task/:id', 'task') // details of specific task
        .when('/plan/task/:id/description', 'task.description')


        // -- Logs
        .when('/logs/eventlog', 'eventlog') // all events
        .when('/logs/alarm', 'alarmlog') // alarms
        .when('/logs/alarm/:id', 'alarmeventlog') // events for selected alarm
        .when('/logs/taskGroup', 'taskGroupLogs') // taskGroups started
        .when('/logs/taskGroup/:id', 'taskGroupEventlogs') // events for selected taskGroup

        // -- Reports
        .when('/report/view/:reportId', 'report') // any report identified by reportId
        .when('/report/alarm', 'alarmreports') // all alarm reports
        .when('/report/alarm/:id', 'alarmreport') // report for selected alarm
        .when('/report/task', 'taskreports') // all task reports
        .when('/report/task/:id', 'taskreport')  // report for selected task
        .when('/report/static', 'staticreports') // all static reports

        .segment('home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'})

        .segment('login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
        })
        .segment('home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'})

        /**
         * --
         * SECTION ACCOUNT
         * --
         */
        .segment('account', {
            templateUrl: 'partials/account/account.html',
            controller: 'AccountCtrl'
        }).within(). // account
        segment('user', {
            templateUrl: 'partials/account/user.html', controller: 'UserCtrl',
            resolve: {
                parseUser: function () {
                    return Parse.User.current().fetch();
                }
            }
            , untilResolved: {
                templateUrl: smallHorizontalLoader
            }
        }).segment('settings', {
            templateUrl: 'partials/account/settings.html',
            resolve: {
                parseUser: function () {
                    return Parse.User.current().fetch();
                }
            }
            , untilResolved: {
                templateUrl: smallHorizontalLoader
            }
        }).segment('purchase', {templateUrl: 'partials/account/purchase.html', controller: 'PurchaseCtrl'}).up().

        //	segment('report', {templateUrl: 'partials/report/report.html', controller: 'ReportCtrl'}).
        //	within(). // report

        //	up().

        // segment('client_eventtypes', {templateUrl:
        // 'partials/crud/data/eventtypes.html', controller: 'EventTypeCtrl'}).
        /**
         * --
         * SECTION DATA
         * --
         */
        segment('guards', {
            templateUrl: 'partials/crud/data/guards.html', controller: 'StandardCRUDCtrl',
            resolve: {
                ParseObject: function (ParseGuard) {
                    return ParseGuard;
                },
                scopedObjects: function (ParseGuard) {
                    return ParseGuard.fetchAll(); // load objects before showing the partial
                }
            }
            , untilResolved: {
                templateUrl: smallHorizontalLoader
            }
        }).
        //		segment('crud', {templateUrl: 'partials/crud/crud.html', controller: 'CRUDCtrl'}).
        //	    within(). // crud
        segment('groups', {
            templateUrl: 'partials/crud/data/groups.html', controller: 'StandardCRUDCtrl',
            resolve: {
                ParseObject: function (ParseGroup) {
                    return ParseGroup;
                },
                scopedGroups: function (ParseGroup) {
                    return ParseGroup.fetchAll(); // load objects before showing the partial
                }
            }
            , untilResolved: {
                templateUrl: smallHorizontalLoader
            }
        }).segment('clients', {
            templateUrl: 'partials/crud/data/clients.html', controller: 'StandardCRUDCtrl',
            resolve: {
                ParseObject: function (ParseClient) {
                    return ParseClient;
                },
                scopedClients: function (ParseClient) {
                    var query = ParseClient.fetchAllQuery();
                    query.notEqualTo('isAutoCreated', true);
                    query.notEqualTo('automatic', true);
                    return ParseClient.fetchAll(query); // load objects before showing the partial
                }
            }
            , untilResolved: {
                templateUrl: smallHorizontalLoader
            }
        }).
        // details segment for client
        segment('client', {
            templateUrl: 'partials/crud/data/client/client.details_nav.html',
            dependencies: ['id'],
            controller: 'ParseDetailsCtrl',
            resolve: {
                ParseObject: ['ParseClient', function (ParseClient) {
                    return ParseClient;
                }],
                scopedObject: ['$routeParams', 'ParseClient', function ($routeParams, ParseClient) {
                    // !!!!
                    return ParseClient.get($routeParams.id);//, ['contacts', 'roomLocations', 'messages']);
                }],
            }
        }).within()
            // available details segments for client
            .segment('data', {
                default: true,
                templateUrl: 'partials/crud/data/client/client.data.html',
            })
            .segment('contacts', {
                templateUrl: 'partials/crud/data/client/client.contacts.html',
                controller: 'ParseArrayPointerCtrl',
                resolve: {
                    ParentParseObject: ['ParseClient', function (ParseClient) {
                        return ParseClient;
                    }],
                    scopedParentObject: ['ParseClient', function (ParseClient) {
                        return ParseClient.getScopedObjectFromRouteParamId('id', 'contacts');
                    }],
                    ParseObject: ['ParseClientContact', function (ParseClientContact) {
                        return ParseClientContact;
                    }],
                    arrayName: function () {
                        return "contacts";
                    },
                }
                , untilResolved: {
                    templateUrl: smallHorizontalLoader
                }
            })
            .segment('locations', {
                templateUrl: 'partials/crud/data/client/client.locations.html',
                controller: 'ParseArrayPointerCtrl',
                resolve: {
                    ParentParseObject: ['ParseClient', function (ParseClient) {
                        return ParseClient;
                    }],
                    scopedParentObject: ['ParseClient', function (ParseClient) {
                        return ParseClient.getScopedObjectFromRouteParamId('id', 'roomLocations');
                    }],
                    ParseObject: ['ParseClientLocation', function (ParseClientLocation) {
                        return ParseClientLocation;
                    }],
                    arrayName: function () {
                        return "roomLocations";
                    },
                }
                , untilResolved: {
                    templateUrl: smallHorizontalLoader
                }
            })
            .segment('messages', {
                templateUrl: 'partials/crud/data/client/client.messages.html',
                controller: 'ParseArrayPointerCtrl',
                resolve: {
                    ParentParseObject: ['ParseClient', function (ParseClient) {
                        return ParseClient;
                    }],
                    scopedParentObject: ['ParseClient', function (ParseClient) {
                        return ParseClient.getScopedObjectFromRouteParamId('id', 'messages');
                    }],
                    ParseObject: ['ParseMessage', function (ParseMessage) {
                        return ParseMessage;
                    }],
                    arrayName: function () {
                        return "messages";
                    }
                }
                , untilResolved: {
                    templateUrl: smallHorizontalLoader
                }
            })
            .segment('eventtypes', {
                templateUrl: 'partials/crud/data/client/client.eventtypes.html',
                controller: 'StandardCRUDCtrl',
                resolve: {
                    ParseObject: ['ParseEventType', 'ParseClient', function (ParseEventType, ParseClient) {
                        var pointer = ParseClient.getPointerObjectFromRouteParamId('id');
                        ParseEventType.addHiddenData({
                            client: pointer
                        });
                        return ParseEventType;
                    }],
                    scopedEventTypes: ['ParseEventType', 'ParseClient', function (ParseEventType, ParseClient) {
                        var pointer = ParseClient.getPointerObjectFromRouteParamId('id');
                        var query = ParseEventType.fetchAllQuery();
                        query.equalTo('client', pointer);
                        return ParseEventType.fetchAll(query); // load objects before showing the partial
                    }]
                }
                , untilResolved: {
                    templateUrl: smallHorizontalLoader
                }
            })
            .segment('history', {
                templateUrl: 'partials/crud/data/client/client.history.html', controller: 'ParseSearchWithQueryCtrl',
                resolve: {
                    ParseObject: ['ParseEventLog', function (ParseEventLog) {
                        return ParseEventLog
                    }],
                    parseQuery: ['ParseEventLog', 'ParseClient', function (ParseEventLog, ParseClient) {
                        var query = ParseEventLog.fetchAllQuery();
                        var clientPointer = ParseClient.getPointerObjectFromRouteParamId('id');
                        query.equalTo('client', clientPointer);
                        //query.equalTo('task_event', "OTHER");

                        return query;
                    }]
                }
            })
            .segment('statistics', {
                templateUrl: 'partials/crud/data/client/client.statistics.html', controller: 'ParseSearchWithQueryCtrl',
                resolve: {
                    ParseObject: ['ParseEventLog', function (ParseEventLog) {
                        return ParseEventLog
                    }],
                    parseQuery: ['ParseEventLog', 'ParseClient', function (ParseEventLog, ParseClient) {
                        var query = ParseEventLog.fetchAllQuery();
                        var clientPointer = ParseClient.getPointerObjectFromRouteParamId('id');
                        query.equalTo('client', clientPointer);
                        query.equalTo('task_event', "OTHER");

                        return query;
                    }]
                }
            })
            .up()
            .segment('eventtypes', {
                templateUrl: 'partials/crud/data/eventtypes.html', controller: 'StandardCRUDCtrl',
                resolve: {
                    ParseObject: function (ParseEventType) {
                        return ParseEventType;
                    },
                    scopedEventTypes: ['ParseEventType', 'ParseClient', function (ParseEventType, ParseClient) {
                        var query = ParseEventType.fetchAllQuery();
                        query.doesNotExist('client');
                        return ParseEventType.fetchAll(query); // load objects before showing the partial
                    }]
                }
                , untilResolved: {
                    templateUrl: smallHorizontalLoader
                }
            }).
        /**
         * --
         * SECTION CHECKLISTS
         * --
         */
        segment('checklist_startup', {
            templateUrl: 'partials/crud/checklist/startup.html', controller: 'StandardCRUDCtrl',
            resolve: {
                ParseObject: function (ParseChecklistStart) {
                    return ParseChecklistStart;
                },
                scopedChecklistStarts: function (ParseChecklistStart) {
                    return ParseChecklistStart.fetchAll(); // load objects before showing the partial
                }
            }
            , untilResolved: {
                templateUrl: smallHorizontalLoader
            }
        }).segment('checklist_ending', {
            templateUrl: 'partials/crud/checklist/ending.html', controller: 'StandardCRUDCtrl',
            resolve: {
                ParseObject: function (ParseChecklistEnd) {
                    return ParseChecklistEnd;
                },
                scopedChecklistEnds: function (ParseChecklistEnd) {
                    return ParseChecklistEnd.fetchAll(); // load objects before showing the partial
                }
            }
            , untilResolved: {
                templateUrl: smallHorizontalLoader
            }
        }).
            /**
             * --
             * SECTION PLANNING
             * --
             */
            segment('taskGroups', {
                templateUrl: 'partials/crud/planning/taskGroups.html', controller: 'StandardCRUDCtrl',
                resolve: {
                    ParseObject: function (ParseTaskGroup) {
                        return ParseTaskGroup;
                    },
                    scopedTaskGroups: function (ParseTaskGroup) {
                        return ParseTaskGroup.fetchAll(); // load objects before showing the partial
                    }
                }
                , untilResolved: {
                    templateUrl: smallHorizontalLoader
                }
            })
            .segment('tasks', {
                templateUrl: 'partials/crud/planning/tasks.html',
                dependencies: ['taskGroupId'],
                controller: 'StandardCRUDCtrl',
                resolve: {
                    ParseObject: ['ParseTask', 'ParseTaskGroup', function (ParseTask, ParseTaskGroup) {
                        var pointer = ParseTaskGroup.getPointerObjectFromRouteParamId('taskGroupId');
                        ParseTask.addHiddenData({
                            taskGroup: pointer
                        });
                        return ParseTask;
                    }],
                    scopedObjects: ['ParseTask', 'ParseTaskGroup', function (ParseTask, ParseTaskGroup) {
                        var pointer = ParseTaskGroup.getPointerObjectFromRouteParamId('taskGroupId');
                        var query = ParseTask.getQuery(pointer);
                        console.log('pointer', pointer);
                        return ParseTask.fetchAll(query); // load objects before showing the partial
                    }]
                }
                , untilResolved: {
                    templateUrl: smallHorizontalLoader
                }
            }).
        // details segment for task
        segment('task', {
            templateUrl: 'partials/crud/planning/task/details_nav.html',
            dependencies: ['id'],
            controller: 'ParseDetailsCtrl',
            resolve: {
                ParseObject: ['ParseTask', function (ParseTask) {
                    return ParseTask;
                }],
                scopedObject: ['ParseTask', function (ParseTask) {
                    return ParseTask.getScopedObjectFromRouteParamId('id', 'client');
                }]
            }
            , untilResolved: {
                templateUrl: smallHorizontalLoader
            }
        }).within()
            // available details segments for task
            .segment('description', {
                default: true,
                templateUrl: 'partials/crud/planning/task/description.html'
            }).up().


        /**
         * --
         * SECTION HISTORY
         * --
         */
        // shows the complete set of events
        segment('eventlog', {
            templateUrl: 'partials/log/eventlog.html', controller: 'StandardParseSearchCtrl',
            resolve: {
                ParseObject: ['ParseEventLog', function (ParseEventLog) {
                    return ParseEventLog
                }]
            }
        }).
        // alarms
        segment('alarmlog', {
            templateUrl: 'partials/log/alarmlog.html', controller: 'StandardParseSearchCtrl',
            resolve: {
                ParseObject: ['ParseAlarm', function (ParseAlarm) {
                    return ParseAlarm
                }]
            }
        }).
        // alarms list events of a selected alarm
        segment('alarmeventlog', {
            templateUrl: 'partials/log/eventlog.html', dependencies: ['id'], controller: 'ParseLogResultCtrl',
            resolve: {
                ParseObject: ['ParseEventLog', function (ParseEventLog) {
                    return ParseEventLog
                }],
                scopedObjects: ['ParseEventLog', 'ParseAlarm', function (ParseEventLog, ParseAlarm) {
                    // standard query
                    var query = ParseEventLog.fetchAllQuery();
                    // exlude login and logout events
                    ParseEventLog.excludeLoginLogout(query);
                    // matching taskGroupstarted with object id equal param id
                    var pointer = ParseAlarm.getPointerObjectFromRouteParamId('id');
                    query.equalTo('alarm', pointer);
                    return ParseEventLog.fetchAll(query);
                }]
            }
            , untilResolved: {
                templateUrl: smallHorizontalLoader
            }
        }).
        // regular tasks
        segment('taskGroupLogs', {
            templateUrl: 'partials/log/taskGroupLogs.html', controller: 'StandardParseSearchCtrl',
            resolve: {
                ParseObject: ['ParseTaskGroupStarted', function (ParseTaskGroupStarted) {
                    return ParseTaskGroupStarted
                }]
            }
        }).
        // regular tasks list events of selected taskGroup
        segment('taskGroupEventlogs', {
            templateUrl: 'partials/log/eventlog.html', dependencies: ['id'], controller: 'ParseLogResultCtrl',
            resolve: {
                ParseObject: ['ParseEventLog', function (ParseEventLog) {
                    return ParseEventLog
                }],
                scopedObjects: ['ParseEventLog', 'ParseTaskGroupStarted', function (ParseEventLog, ParseTaskGroupStarted) {
                    // standard query
                    var query = ParseEventLog.fetchAllQuery();
                    // exlude login and logout events
                    ParseEventLog.excludeLoginLogout(query);
                    // matching taskGroupstarted with object id equal param id
                    var pointer = ParseTaskGroupStarted.getPointerObjectFromRouteParamId('id');
                    query.equalTo('taskGroupStarted', pointer);
                    console.log('pointer', pointer);
                    return ParseEventLog.fetchAll(query);
                }]
            }
            , untilResolved: {
                templateUrl: smallHorizontalLoader
            }
        }).

        /**
         * --
         * SECTION REPORTS
         * --
         */
        // TODO should work for any type of report
        segment('report', {
             dependencies: ['reportId'], controller: 'ReportCtrl',
            resolve: {
                reportObject: ['ParseReport', function (ParseReport) {
                    return ParseReport.findScopedObjectEqualToParam('reportId', 'reportId', ['owner', 'owner.staticReportSettings', 'eventLogs']);
                }]
            },
            resolveFailed: {
                templateUrl: 'partials/error/report_not_found.html'
            }
            , untilResolved: {
                templateUrl: smallHorizontalLoader
            }
        }).segment('alarmreports', {
            templateUrl: 'partials/report/alarm_list_reports.html', controller: 'ParseSearchWithQueryCtrl',
            resolve: {
               ParseObject: ['ParseReport', function (ParseReport) {
                    return ParseReport
                }],
                parseQuery: ['ParseReport', function (ParseReport) {
                    return ParseReport.alarmsQuery()
                }]
            }
        }).segment('alarmreport', {
            templateUrl: 'partials/report/alarm_report.html', dependencies: ['id'], controller: 'AlarmReportCtrl',
            resolve: {
                scopedAlarm: ['ParseAlarm', function (ParseAlarm) {
                    return ParseAlarm.getScopedObjectFromRouteParamId('id');
                }]
            },
            resolveFailed: {
                templateUrl: 'partials/error/alarm_report_not_found.html'
            }
            , untilResolved: {
                templateUrl: smallHorizontalLoader
            }
        }).segment('taskreports', {
            templateUrl: 'partials/report/task_list_reports.html', controller: 'ParseSearchWithQueryCtrl',
            resolve: {
                ParseObject: ['ParseReport', function (ParseReport) {
                    return ParseReport
                }],
                parseQuery: ['ParseReport', function (ParseReport) {
                    return ParseReport.tasksQuery()
                }]
            }
        }).segment('districtwatchreports', {
            templateUrl: 'partials/report/districtwatch_list_reports.html', controller: 'ParseSearchWithQueryCtrl',
            resolve: {
                ParseObject: ['ParseReport', function (ParseReport) {
                    return ParseReport
                }],
                parseQuery: ['ParseReport', function (ParseReport) {
                    return ParseReport.districtWatchQuery()
                }]
            }
        }).segment('staticreports', {
            templateUrl: 'partials/report/static_list_reports.html', controller: 'ParseSearchWithQueryCtrl',
            resolve: {
                ParseObject: ['ParseReport', function (ParseReport) {
                    return ParseReport
                }],
                parseQuery: ['ParseReport', function (ParseReport) {
                    return ParseReport.staticSupervisionQuery()
                }]
            }
        }).segment('taskreport', {
            templateUrl: 'partials/report/task_report.html', dependencies: ['id'], controller: 'ReportCtrl',
            resolve: {
                reportObject: ['ParseReport', function (ParseReport) {
                    return ParseReport.getScopedObjectFromRouteParamId('id');
                }]
            },
            resolveFailed: {
                templateUrl: 'partials/error/report_not_found.html'
            }
            , untilResolved: {
                templateUrl: smallHorizontalLoader
            }
        });



        $routeProvider.otherwise({redirectTo: '/login'});
    }]);
