'use strict';


// Declare app level module which depends on filters, and services
angular.module('GuardSwiftApp', [
        'chart.js',
        'angularPayments',
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
            key: 'AIzaSyBJxeP1LuaYrWmzOKDKo3l4a_nc4G7OaFU',
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

        $routeSegmentProvider.when('/login', 'login').when('/logout', 'logout').when('/home', 'home').when('/crud', 'crud').

        // -- Account
        when('/account/user', 'account.user').when('/account/settings', 'account.settings').when('/account/purchase', 'account.purchase').


        // -- Data
        when('/data/groups', 'groups').when('/data/guards', 'guards').when('/data/clients', 'clients').when('/data/client/:id', 'client').when('/data/client/:id/data', 'client.data'). // default
        when('/data/client/:id/contacts', 'client.contacts').when('/data/client/:id/locations', 'client.locations').when('/data/client/:id/messages', 'client.messages').when('/data/client/:id/eventtypes', 'client.eventtypes').when('/data/client/:id/history', 'client.history').when('/data/client/:id/statistics', 'client.statistics').when('/data/eventtypes', 'eventtypes').

        // -- Details
        //	when('/details', 'details').
        //	when('/details/client/:id/data', 'details.client.crud.data').
        //	when('/details/client/:id/contacts', 'details.client.crud.contacts').
        //	when('/details/client/:id/locations', 'details.client.crud.locations').
        //	when('/details/client/:id/messages', 'details.client.crud.messages').
        //	when('/details/client/:id/eventtypes', 'details.client.crud.eventtypes').
        //	when('/details/client/log', 'details.client.log').
        //	when('/details/client/log/:id/history', 'details.client.log.history').
        //	when('/details/client/log/:id/statistics', 'details.client.log.statistics').

        //	when('/details/circuitunit/:id/description', 'details.circuitunit.crud.description').
        //	when('/details/circuitunit/:id/messages', 'details.circuitunit.crud.messages').

        //	when('/details/eventlog/:id', 'details.eventlog').

        // -- Checklist
        when('/checklist/startup', 'checklist_startup').when('/checklist/ending', 'checklist_ending').

        // -- Planning
        when('/plan/circuits', 'circuits').when('/plan/circuitunits/:circuitId', 'circuitunits'). // list circuitunits under specific circuit
        when('/plan/circuitunit/:id', 'circuitunit'). // details of specific circuitunit
        when('/plan/circuitunit/:id/description', 'circuitunit.description').when('/plan/districtwatches', 'districtwatches').when('/plan/districtwatchunits/:districtWatchId', 'districtwatchunits').


        // -- Logs
        when('/logs/eventlog', 'eventlog'). // all events
        when('/logs/alarm', 'alarmlog'). // alarms
        when('/logs/alarm/:id', 'alarmeventlog'). // events for selected alarm
        when('/logs/circuit', 'circuitlog'). // circuits started
        when('/logs/circuit/:id', 'circuiteventlog'). // events for selected circuit
        when('/logs/districtwatch', 'districtwatchlog'). // districtwatches started
        when('/logs/districtwatch/:id', 'districtwatcheventlog'). // events for selected districtwatch

        // -- Reports
        when('/report/view/:reportId', 'report'). // any report identified by reportId
        when('/report/alarm', 'alarmreports'). // all alarm reports
        when('/report/alarm/:id', 'alarmreport'). // report for selected alarm
        when('/report/circuitunit', 'circuitunitreports'). // all circuitunit reports
        when('/report/circuitunit/:id', 'circuitunitreport').  // report for selected circuitunit
        when('/report/static', 'staticreports'). // all static reports

        // -- GPS
        when('/gps', 'gps'). // searchable GPS tracker
        when('/gps/regular_panel', 'experiments_regular_panel').when('/gps/regular_pocket', 'experiments_regular_pocket').when('/gps/regular_upper', 'experiments_regular_upper').when('/gps/dw_1', 'experiments_dw1').when('/gps/dw_2', 'experiments_dw2').when('/gps/dw_3', 'experiments_dw3').when('/gps/dw_4', 'experiments_dw4').when('/gps/dw_5', 'experiments_dw5').when('/gps/dw_6', 'experiments_dw6').when('/gps/dw_7', 'experiments_dw7').

        // -- Public logs
        //	when('/public/logs/gps/:id', 'log.gpspublic').
        //	when('/public/alarm/:id', 'report.alarm').

        segment('login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
        }).segment('home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'}).

        /**
         * --
         * SECTION ACCOUNT
         * --
         */
        segment('account', {
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
                    return ParseClient.fetchAll(); // load objects before showing the partial
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
                    scopedEventTypes: function (ParseEventType) {
                        return ParseEventType.fetchAll(); // load objects before showing the partial
                    }
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
            segment('circuits', {
                templateUrl: 'partials/crud/planning/circuits.html', controller: 'StandardCRUDCtrl',
                resolve: {
                    ParseObject: function (ParseCircuit) {
                        return ParseCircuit;
                    },
                    scopedCircuits: function (ParseCircuit) {
                        return ParseCircuit.fetchAll(); // load objects before showing the partial
                    }
                }
                , untilResolved: {
                    templateUrl: smallHorizontalLoader
                }
            })
            .segment('circuitunits', {
                templateUrl: 'partials/crud/planning/circuitunits.html',
                dependencies: ['circuitId'],
                controller: 'StandardCRUDCtrl',
                resolve: {
                    ParseObject: ['ParseCircuitUnit', 'ParseCircuit', function (ParseCircuitUnit, ParseCircuit) {
                        var pointer = ParseCircuit.getPointerObjectFromRouteParamId('circuitId');
                        ParseCircuitUnit.addHiddenData({
                            circuit: pointer
                        });
                        return ParseCircuitUnit;
                    }],
                    scopedCircuitUnits: ['ParseCircuitUnit', 'ParseCircuit', function (ParseCircuitUnit, ParseCircuit) {
                        var pointer = ParseCircuit.getPointerObjectFromRouteParamId('circuitId');
                        var query = ParseCircuitUnit.getQuery(pointer);
                        return ParseCircuitUnit.fetchAll(query); // load objects before showing the partial
                    }],
                }
                , untilResolved: {
                    templateUrl: smallHorizontalLoader
                }
            }).
        // details segment for circuitunit
        segment('circuitunit', {
            templateUrl: 'partials/crud/planning/circuitunit/details_nav.html',
            dependencies: ['id'],
            controller: 'ParseDetailsCtrl',
            resolve: {
                ParseObject: ['ParseCircuitUnit', function (ParseCircuitUnit) {
                    return ParseCircuitUnit;
                }],
                scopedObject: ['ParseCircuitUnit', function (ParseCircuitUnit) {
                    return ParseCircuitUnit.getScopedObjectFromRouteParamId('id', 'client');
                }],
            }
            , untilResolved: {
                templateUrl: smallHorizontalLoader
            }
        }).within()
            // available details segments for circuitunit
            .segment('description', {
                default: true,
                templateUrl: 'partials/crud/planning/circuitunit/description.html'
            }).up().
            //	segment('circuitselect', {templateUrl: 'partials/crud/crud-parent-select.html', controller: 'CircuitSelectCtrl',
            //		resolve : {
            //			scopedCircuits : function(ParseCircuit) {
            //				return ParseCircuit.getAllScopedObjects();
            //			},
            //			clients : function(ParseClient) {
            //				return ParseClient.getAllObjects();
            //			},
            //			translations : function($q, $translate) {
            //				var deferredTranslation = $q.defer();
            //				$translate(
            //						['CIRCUITS_SELECT', 'CIRCUITUNITS_NONE_SELECTED',
            //							'CIRCUITS_CREATE'])
            //						.then(
            //								function(translations) {
            //									var result = {
            //										selectionEmpty : translations.CIRCUITS_SELECT,
            //										contentEmpty : translations.CIRCUITUNITS_NONE_SELECTED,
            //										parentCreate : translations.CIRCUITS_CREATE
            //									};
            //									deferredTranslation.resolve(result);
            //								});
            //				return deferredTranslation.promise;
            //			}
            //		}
            //		, untilResolved: {
            //            templateUrl: smallHorizontalLoader
            //        }})
            //	.within()
            //    .segment('circuitunits', {
            //        templateUrl: 'partials/crud/planning/circuitunits.html',
            //        dependencies: ['circuitId'],
            //        controller: 'CircuitUnitCtrl',
            //		resolve : {
            //			ParseCircuitUnit: function(ParseCircuitUnit) {
            //				return ParseCircuitUnit.getParseObject();
            //			},
            //			selectedCircuit : function(ParseCircuit) {
            //				return ParseCircuit.getScopedObjectFromId();
            //			},
            //			scopedCircuitUnits : function(ParseCircuitUnit) {
            //				return ParseCircuitUnit.getAllScopedObjects();
            //			},
            //			timeStrings : function(TimeStrings) {
            //				return TimeStrings;
            //			}
            //		}
            //		, untilResolved: {
            //            templateUrl: smallHorizontalLoader
            //        }})
            //        .up().
            segment('districtwatches', {
                templateUrl: 'partials/crud/planning/districtwatch.html', controller: 'StandardCRUDCtrl',
                resolve: {
                    ParseObject: function (ParseDistrictWatch) {
                        return ParseDistrictWatch;
                    },
                    scopedDistrictWatches: function (ParseDistrictWatch) {
                        return ParseDistrictWatch.fetchAll(); // load objects before showing the partial
                    }
                }
                , untilResolved: {
                    templateUrl: smallHorizontalLoader
                }
            })
            //	.within()
            .segment('districtwatchunits', {
                templateUrl: 'partials/crud/planning/districtwatchunits.html',
                dependencies: ['districtWatchId'],
                controller: 'StandardCRUDCtrl',
                resolve: {
                    ParseObject: ['ParseDistrictWatchUnit', 'ParseDistrictWatch', function (ParseDistrictWatchUnit, ParseDistrictWatch) {
                        var pointer = ParseDistrictWatch.getPointerObjectFromRouteParamId('districtWatchId');
                        ParseDistrictWatchUnit.addHiddenData({
                            districtWatch: pointer
                        });
                        return ParseDistrictWatchUnit;
                    }],
                    scopedObjects: ['ParseDistrictWatchUnit', 'ParseDistrictWatch', function (ParseDistrictWatchUnit, ParseDistrictWatch) {
                        var pointer = ParseDistrictWatch.getPointerObjectFromRouteParamId('districtWatchId');
                        var query = ParseDistrictWatchUnit.getQuery(pointer);
                        return ParseDistrictWatchUnit.fetchAll(query); // load objects before showing the partial
                    }],
                }
                , untilResolved: {
                    templateUrl: smallHorizontalLoader
                }
            }).
        //    .up()

        //	.segment('details', {templateUrl: 'partials/details/details.html', controller: 'DetailsCtrl'}).
        //	within(). // details
        //		segment('eventlog', {templateUrl: 'partials/details/eventlog.html', dependencies: ['id'], controller: 'EventlogDetailsCtrl'}).
        //		segment('client', {templateUrl: 'partials/details/client/client.html',  controller: 'ClientDetailsCtrl',
        //			resolve : {
        //				ParseClient : function(ParseClient) {
        //					return ParseClient.getParseObject();
        //				},
        //				ParseClientContact : function(ParseClientContact) {
        //					return ParseClientContact.getParseObject();
        //				},
        //				ParseClientLocation : function(ParseClientLocation) {
        //					return ParseClientLocation.getParseObject();
        //				},
        //				ParseMessage : function(ParseMessage) {
        //					return ParseMessage.getParseObject();
        //				},
        //				scopedClientFromId : function(ParseClient) {
        //					return ParseClient.getScopedObjectFromId(["contacts", "roomLocations", "messages"]);
        //				}
        //			}, untilResolved: {
        //                templateUrl: smallHorizontalLoader
        //            }}).
        //		within(). // details.client
        //			segment('crud', {templateUrl: 'partials/details/client/client.container.html', controller: 'CRUDCtrl'}).
        //			within(). // details.client.crud
        //				segment('data', {templateUrl: 'partials/details/client/client.data.html', controller: 'ClientDataCtrl'}).
        //				segment('contacts', {templateUrl: 'partials/details/client/client.contacts.html', controller: 'ClientContactsCtrl'}).
        //				segment('locations', {templateUrl: 'partials/details/client/client.locations.html', controller: 'ClientLocationsCtrl'}).
        //				segment('messages', {templateUrl: 'partials/details/client/client.messages.html', controller: 'ClientMessagesCtrl'}).
        //				segment('eventtypes', {templateUrl: 'partials/details/client/client.eventtypes.html', controller: 'EventTypeCtrl',
        //					resolve : {
        //						ParseEventType : function(ParseEventType) {
        //							return ParseEventType.getParseObject();
        //						},
        //						scopedEventTypes : function(ParseEventType) {
        //							return ParseEventType.getAllScopedObjects();
        //						}
        //					}
        //					, untilResolved: {
        //		                templateUrl: smallHorizontalLoader
        //		            }}).
        //		    up(). // details.client
        //            segment('log', {templateUrl: 'partials/details/client/client.container.html', controller: 'LogsCtrl',
        //        		resolve : {
        //        			EventLogObject : function(ParseEventLog) {
        //        				return ParseEventLog.getParseObject();
        //        			},
        //        			timeStrings : function(TimeStrings) {
        //        				return TimeStrings;
        //        			}
        //        		}
        //        		, untilResolved: {
        //                    templateUrl: smallHorizontalLoader
        //                }}).
        //            within(). // details.client.log
        //					segment('history', {templateUrl: 'partials/details/client/client.log.history.html', controller: 'ClientHistoryCtrl'}).
        //					segment('statistics', {templateUrl: 'partials/details/client/client.log.history.html', controller: 'ClientStatisticsCtrl'}).
        //			up().  // details.client
        //		up(). // details
        //		segment('circuitunit', {templateUrl: 'partials/details/circuitunit/circuitunit.html',  controller: 'CircuitUnitDetailsCtrl',
        //			resolve : {
        //				ParseClient : function(ParseClient) {
        //					return ParseClient.getParseObject();
        //				},
        //					ParseCircuitUnit : function(ParseCircuitUnit) {
        //						return ParseCircuitUnit.getParseObject();
        //					},
        ////					ParseClientLocation : function(ParseClientLocation) {
        ////						return ParseClientLocation.getParseObject();
        ////					},
        ////					ParseMessage : function(ParseMessage) {
        ////						return ParseMessage.getParseObject();
        ////					},
        //					scopedCircuitUnitFromId : function(ParseCircuitUnit) {
        //						return ParseCircuitUnit.getScopedObjectFromId(["client","messages"]);
        //					}
        //			}, untilResolved: {
        //                templateUrl: smallHorizontalLoader
        //            }}).
        //		within(). // details.circuitunit
        //			segment('crud', {templateUrl: 'partials/details/circuitunit/circuitunit.container.html', controller: 'CRUDCtrl'}).
        //			within(). // details.circuitunit.crud
        //				segment('description', {templateUrl: 'partials/details/circuitunit/circuitunit.description.html', controller: 'CircuitUnitDescriptionCtrl'}).
        //				segment('messages', {templateUrl: 'partials/details/circuitunit/circuitunit.messages.html', controller: 'CircuitUnitMessagesCtrl'}).
        //			up(). // details.circuitunit
        //		up(). // details
        //	up(). //
        //	segment('log', {templateUrl: 'partials/logs/log.html', controller: 'LogsCtrl',
        //		resolve : {
        ////			EventLogObject : function(ParseEventLog) {
        ////				return ParseEventLog.getParseObject();
        ////			},
        ////			timeStrings : function(TimeStrings) {
        ////				return TimeStrings;
        ////			}
        //		}
        //		, untilResolved: {
        //            templateUrl: smallHorizontalLoader
        //        }}).
        //	within(). // log

        /**
         * --
         * SECTION HISTORY
         * --
         */
        // shows the complete set of events
        segment('eventlog', {
            templateUrl: 'partials/logs/eventlog.html', controller: 'StandardParseSearchCtrl',
            resolve: {
                ParseObject: ['ParseEventLog', function (ParseEventLog) {
                    return ParseEventLog
                }]
            }
        }).
        // alarms
        segment('alarmlog', {
            templateUrl: 'partials/logs/alarmlog.html', controller: 'StandardParseSearchCtrl',
            resolve: {
                ParseObject: ['ParseAlarm', function (ParseAlarm) {
                    return ParseAlarm
                }]
            }
        }).
        // alarms list events of a selected alarm
        segment('alarmeventlog', {
            templateUrl: 'partials/logs/eventlog.html', dependencies: ['id'], controller: 'ParseLogResultCtrl',
            resolve: {
                ParseObject: ['ParseEventLog', function (ParseEventLog) {
                    return ParseEventLog
                }],
                scopedObjects: ['ParseEventLog', 'ParseAlarm', function (ParseEventLog, ParseAlarm) {
                    // standard query
                    var query = ParseEventLog.fetchAllQuery();
                    // exlude login and logout events
                    ParseEventLog.excludeLoginLogout(query);
                    // matching circuitstarted with object id equal param id
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
        segment('circuitlog', {
            templateUrl: 'partials/logs/circuitlog.html', controller: 'StandardParseSearchCtrl',
            resolve: {
                ParseObject: ['ParseCircuitStarted', function (ParseCircuitStarted) {
                    return ParseCircuitStarted
                }]
            }
        }).
        // regular tasks list events of selected circuit
        segment('circuiteventlog', {
            templateUrl: 'partials/logs/eventlog.html', dependencies: ['id'], controller: 'ParseLogResultCtrl',
            resolve: {
                ParseObject: ['ParseEventLog', function (ParseEventLog) {
                    return ParseEventLog
                }],
                scopedObjects: ['ParseEventLog', 'ParseCircuitStarted', function (ParseEventLog, ParseCircuitStarted) {
                    // standard query
                    var query = ParseEventLog.fetchAllQuery();
                    // exlude login and logout events
                    ParseEventLog.excludeLoginLogout(query);
                    // matching circuitstarted with object id equal param id
                    var pointer = ParseCircuitStarted.getPointerObjectFromRouteParamId('id');
                    query.equalTo('circuitStarted', pointer);
                    return ParseEventLog.fetchAll(query);
                }]
            }
            , untilResolved: {
                templateUrl: smallHorizontalLoader
            }
        }).
        // districtwatches
        segment('districtwatchlog', {
            templateUrl: 'partials/logs/districtwatchlog.html', controller: 'StandardParseSearchCtrl',
            resolve: {
                ParseObject: ['ParseDistrictWatchStarted', function (ParseDistrictWatchStarted) {
                    return ParseDistrictWatchStarted
                }],
                parseQuery: ['ParseReport', function (ParseReport) {
                    return ParseReport.circuitUnitsQuery()
                }]
            }
        }).
        // districtwatches list events of a selected districtwatch
        segment('districtwatcheventlog', {
            templateUrl: 'partials/logs/eventlog.html', dependencies: ['id'], controller: 'ParseLogResultCtrl',
            resolve: {
                ParseObject: ['ParseEventLog', function (ParseEventLog) {
                    return ParseEventLog
                }],
                scopedObjects: ['ParseEventLog', 'ParseDistrictWatchStarted', function (ParseEventLog, ParseDistrictWatchStarted) {
                    // standard query
                    var query = ParseEventLog.fetchAllQuery();
                    // exlude login and logout events
                    ParseEventLog.excludeLoginLogout(query);
                    // matching circuitstarted with object id equal param id
                    var pointer = ParseDistrictWatchStarted.getPointerObjectFromRouteParamId('id');
                    query.equalTo('districtWatchStarted', pointer);
                    return ParseEventLog.fetchAll(query);
                }]
            }
            , untilResolved: {
                templateUrl: smallHorizontalLoader
            }
        }).

        //		segment('listeventlogs', {templateUrl: 'partials/logs/eventlog.html', controller: 'EventLogListCtrl'}).
        //		segment('listreports', {templateUrl: 'partials/logs/reportslog.html', controller: 'ReportListCtrl'}).

        /**
         * --
         * SECTION REPORTS
         * --
         */
        // TODO should work for any type of report
        segment('report', {
            templateUrl: 'partials/report/report_switch.html', dependencies: ['reportId'], controller: 'ReportCtrl',
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
            templateUrl: 'partials/report/alarm_list_reports.html', controller: 'StandardParseSearchCtrl',
            resolve: {
                ParseObject: ['ParseAlarm', function (ParseAlarm) {
                    return ParseAlarm
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
        }).segment('circuitunitreports', {
            templateUrl: 'partials/report/circuitunit_list_reports.html', controller: 'ParseSearchWithQueryCtrl',
            resolve: {
                ParseObject: ['ParseReport', function (ParseReport) {
                    return ParseReport
                }],
                parseQuery: ['ParseReport', function (ParseReport) {
                    return ParseReport.circuitUnitsQuery()
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
        }).segment('circuitunitreport', {
            templateUrl: 'partials/report/circuitunit_report.html', dependencies: ['id'], controller: 'ReportCtrl',
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
        }).
        /**
         * --
         * SECTION GPS
         * --
         */
        segment('gps', {
            templateUrl: 'partials/gps/gps.html', controller: 'GPSLogCtrl',
            resolve: {
                ParseObject: ['ParseGPSTracker', function (ParseGPSTracker) {
                    return ParseGPSTracker
                }],
                parseQuery: ['ParseGPSTracker', function (ParseGPSTracker) {
                    return ParseGPSTracker.fetchAllQuery().include('guard')
                }]
            }
        }).segment('experiments_regular_panel', {
            templateUrl: 'partials/gps/experiments.html', controller: 'ExperimentsCtrl',
            resolve: {
                gpsData: ['$http', function ($http) {
                    return $http.get('experiments/regular/instrument_panel/gps.json')
                }],
                eventData: ['$http', function ($http) {
                    return $http.get('experiments/regular/instrument_panel/events.json')
                }],
                groundtruthData: ['$http', function ($http) {
                    return $http.get('experiments/regular/instrument_panel/groundtruth.json')
                }],
                clientData: ['$http', function ($http) {
                    return $http.get('experiments/regular/clients.json')
                }]
            }
        }).segment('experiments_regular_pocket', {
            templateUrl: 'partials/gps/experiments.html', controller: 'ExperimentsCtrl',
            resolve: {
                gpsData: ['$http', function ($http) {
                    return $http.get('experiments/regular/left_pant_pocket/gps.json')
                }],
                eventData: ['$http', function ($http) {
                    return $http.get('experiments/regular/left_pant_pocket/events.json')
                }],
                groundtruthData: ['$http', function ($http) {
                    return $http.get('experiments/regular/left_pant_pocket/groundtruth.json')
                }],
                clientData: ['$http', function ($http) {
                    return $http.get('experiments/regular/clients.json')
                }]
            }
        }).segment('experiments_regular_upper', {
            templateUrl: 'partials/gps/experiments.html', controller: 'ExperimentsCtrl',
            resolve: {
                gpsData: ['$http', function ($http) {
                    return $http.get('experiments/regular/upper_jacket_pocket/gps.json')
                }],
                eventData: ['$http', function ($http) {
                    return $http.get('experiments/regular/upper_jacket_pocket/events.json')
                }],
                groundtruthData: ['$http', function ($http) {
                    return $http.get('experiments/regular/upper_jacket_pocket/groundtruth.json')
                }],
                clientData: ['$http', function ($http) {
                    return $http.get('experiments/regular/clients.json')
                }]
            }
        }).segment('experiments_dw1', {
            templateUrl: 'partials/gps/experiments.html', controller: 'ExperimentsCtrl',
            resolve: {
                gpsData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/1/gps.json')
                }],
                eventData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/1/events.json')
                }],
                groundtruthData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/1/groundtruth.json')
                }],
                clientData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/1/clients.json')
                }]
            }
        }).segment('experiments_dw2', {
            templateUrl: 'partials/gps/experiments.html', controller: 'ExperimentsCtrl',
            resolve: {
                gpsData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/2/gps.json')
                }],
                eventData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/2/events.json')
                }],
                groundtruthData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/2/groundtruth.json')
                }],
                clientData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/2/clients.json')
                }]
            }
        }).segment('experiments_dw3', {
            templateUrl: 'partials/gps/experiments.html', controller: 'ExperimentsCtrl',
            resolve: {
                gpsData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/3/gps.json')
                }],
                eventData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/3/events.json')
                }],
                groundtruthData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/3/groundtruth.json')
                }],
                clientData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/3/clients.json')
                }]
            }
        }).segment('experiments_dw4', {
            templateUrl: 'partials/gps/experiments.html', controller: 'ExperimentsCtrl',
            resolve: {
                gpsData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/4/gps.json')
                }],
                eventData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/4/events.json')
                }],
                groundtruthData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/4/groundtruth.json')
                }],
                clientData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/4/clients.json')
                }]
            }
        }).segment('experiments_dw5', {
            templateUrl: 'partials/gps/experiments.html', controller: 'ExperimentsCtrl',
            resolve: {
                gpsData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/5/gps.json')
                }],
                eventData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/5/events.json')
                }],
                groundtruthData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/5/groundtruth.json')
                }],
                clientData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/5/clients.json')
                }]
            }
        }).segment('experiments_dw6', {
            templateUrl: 'partials/gps/experiments.html', controller: 'ExperimentsCtrl',
            resolve: {
                gpsData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/6/gps.json')
                }],
                eventData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/6/events.json')
                }],
                groundtruthData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/6/groundtruth.json')
                }],
                clientData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/6/clients.json')
                }]
            }
        }).segment('experiments_dw7', {
            templateUrl: 'partials/gps/experiments.html', controller: 'ExperimentsCtrl',
            resolve: {
                gpsData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/7/gps.json')
                }],
                eventData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/7/events.json')
                }],
                groundtruthData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/7/groundtruth.json')
                }],
                clientData: ['$http', function ($http) {
                    return $http.get('experiments/districtwatch/7/clients.json')
                }]
            }
        });


//	when('/gps/dw_1', 'experiments_dw1').
//		segment('gpspublic', {templateUrl: 'partials/logs/gps.html', controller: 'PublicGPSLogCtrl',
//		resolve : {
//			EventLogObject : function(ParseEventLog) {
//				return ParseEventLog.getScopedObjectFromId();
//			}
//		},
//        resolveFailed: {
//            templateUrl: 'partials/error/gps_log_not_found.html'
////            controller: 'ErrorCtrl'
//        }
//		, untilResolved: {
//            templateUrl: smallHorizontalLoader
//        }});
//	up(). //


//     .up();

        $routeProvider.otherwise({redirectTo: '/login'});
    }]);
