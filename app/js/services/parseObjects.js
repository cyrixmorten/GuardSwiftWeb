'use strict';

var app = angular.module('GuardSwiftApp.services');


app.factory('ParseFactory' , [
             'ParseClient', 'ParseGuard',
             'ParseEventType',
             'ParseClientContact', 'ParseClientLocation',
             'ParseTaskGroup', 'ParseTaskGroupStarted', 'ParseTask',
             'ParseReport', 'ParseEventLog', 'ParseTracker',
             function(ParseClient, ParseGuard,
                     ParseEventType, ParseClientContact, ParseClientLocation,
                     ParseTaskGroup, ParseTaskGroupStarted, ParseTask,
					  ParseReport, ParseEventLog, ParseTracker) {

             var data = {
            		 'Client' : ParseClient,
            		 'Guard' : ParseGuard,
            		 'EventType' : ParseEventType,
            		 'ClientContact' : ParseClientContact,
            		 'ClientLocation' : ParseClientLocation,
            		 'TaskGroup' : ParseTaskGroup,
            		 'taskGroupStarted' : ParseTaskGroupStarted,
            		 'TaskGroupUnit' : ParseTask,
            		 'Report' : ParseReport,
            		 'EventLog' : ParseEventLog,
				 	'ParseTracker': ParseTracker
             };


             return {
            	 getAll : function() {
            		 return data;
            	 }
             }

}]);
/**
 * DATA
 */

app.factory('ParseClient', [
		'StandardParseObject',
		function(StandardParseObject) {
			var ParseObject = new StandardParseObject({
				objectname : 'Client',
				emptyTemplate : {
					clientId : '',
					name : '',
					addressName : '',
					addressNumber : '',
					cityName : '',
					zipcode : '',
					fullAddress: '',
					email : '',
					receiveEventEmail : false,
					position : new Parse.GeoPoint({latitude: 40.0, longitude: -30.0}),
					roomLocations : [],
					contacts : [],
					messages : [],
					isAutoCreated: false,
					useAltHeaderLogo: false,
					useCustomPosition: false,
				},
				filledTemplate : function(client) {
					return {
						clientId : client.get('clientId'),
						name : client.get('name'),
						addressName : client.get('addressName'),
						addressNumber : client.get('addressNumber'),
						cityName : client.get('cityName'),
						zipcode : client.get('zipcode'),
						fullAddress: client.get('fullAddress'),
						email : client.get('email'),
						receiveEventEmail : client.get('receiveEventEmail'),
						position : client.get('position'),
						roomLocations : client.get('roomLocations'),
						contacts : client.get('contacts'),
						messages : client.get('messages'),
                        isAutoCreated: client.get('isAutoCreated'),
						useAltHeaderLogo: client.get('useAltHeaderLogo'),
						useCustomPosition: client.get('useCustomPosition'),
					};
				}
			});

			return angular.extend(ParseObject, {
                notAutoCreatedQuery : function() {
                    var query = ParseObject.fetchAllQuery();
                    query.notEqualTo('isAutoCreated', true);
                    return query;
                },
				sorting : {
					name : 'asc'
				}
			});
		}]);

app.factory('ParseTracker', ['StandardParseObject',
    function(StandardParseObject) {
        var ParseObject = new StandardParseObject({
            objectname : 'Tracker',
            emptyTemplate : {
                start : new Date(),
                end : new Date(),
                minuts: 0,
				guard: {},
				gpsFile: {}
            },
            filledTemplate : function(tracker) {
                return {
                    start : tracker.get('start'),
                    end : tracker.get('start'),
                    minuts: tracker.get('minutes'),
                    guard: tracker.get('guard'),
                    gpsFile: tracker.get('gpsFile')
                };
            }
        });

        return angular.extend(ParseObject, {
        });
    }]);

app.factory('ParseGuard', ['StandardParseObject',
		function(StandardParseObject) {
			var ParseObject = new StandardParseObject({
				objectname : 'Guard',
				emptyTemplate : {
					guardId : '',
					name : '',
                    accessStatic: true,
                    accessRegular: true,
                    accessDistrict: true
				},
				filledTemplate : function(guard) {
					return {
						guardId : guard.get('guardId'),
						name : guard.get('name'),
                        accessStatic: guard.get('accessStatic'),
                        accessRegular: guard.get('accessRegular'),
                        accessDistrict: guard.get('accessDistrict')
					};
				}
			});

			return angular.extend(ParseObject, {
				sorting : {
					name : 'asc'
				}
			});
		}]);


app.factory('ParseEventType', ['StandardParseObject', 'ParseClient',
		function(StandardParseObject, ParseClient) {
			var ParseObject = new StandardParseObject({
				objectname : 'EventType',
				emptyTemplate : {
					name : '',
					hasAmount: true,
					hasPeople: true,
					hasLocations: true,
					hasRemarks: true
				},
				filledTemplate : function(event) {
					return {
						name : event.get('name'),
						hasAmount: event.get('hasAmount'),
						hasPeople: event.get('hasPeople'),
						hasLocations: event.get('hasLocations'),
						hasRemarks: event.get('hasRemarks')
					};
				},
			});

			return angular.extend(ParseObject, {
				sorting : {
					name : 'asc'
				}
			});
		}]);


app.factory('ParseClientContact', ['StandardParseObject',
		function(StandardParseObject) {

			var ParseObject = new StandardParseObject({
				objectname : 'ClientContact',
				emptyTemplate : {
					name : '',
					desc : '',
					phoneNumber : '',
					email : '',
					receiveReports : false
				},
				filledTemplate : function(object) {
					return {
						name : object.get('name'),
						desc : object.get('desc'),
						phoneNumber : object.get('phoneNumber'),
						email : object.get('email'),
						receiveReports : object.get('receiveReports') || false
					};
				}
			});

			return angular.extend(ParseObject, {});
		}]);

app.factory('ParseClientLocation', ['StandardParseObject',
		function(StandardParseObject) {

			var ParseObject = new StandardParseObject({
				objectname : 'ClientLocation',
				emptyTemplate : {
					location : '',
					isCheckpoint : false
				},
				filledTemplate : function(object) {
					return {
						location : object.get('location'),
						isCheckpoint : object.get('isCheckpoint')
					};
				}
			});

			return angular.extend(ParseObject, {});
		}]);

/**
 * PLANNING
 */

app.factory('ParseTaskGroup', [
		'StandardParseObject',
		function(StandardParseObject) {
			var ParseObject = new StandardParseObject({
				objectname : 'TaskGroup',
				emptyTemplate : {
					name : '',
					timeResetDate : function() {
						var date = new Date();
						date.setHours(6);
						date.setMinutes(0);
						return date;
					}(),
					days : [0, 1, 2, 3, 4, 5, 6]
				},
				filledTemplate : function(object) {
					return {
						name : object.get('name'),
						timeResetDate : object.get('timeResetDate'),
						days : object.get('days')
					};
				}
			});

			return angular.extend(ParseObject, {
				sorting : {
					name : 'asc'
				}
			});
		}]);

app.factory('ParseTask', [
		'StandardParseObject',
		'ParseClient',
		function(StandardParseObject, ParseClient) {
			var ParseObject = new StandardParseObject({
				objectname : 'Task',
				emptyTemplate : {
					name : '',
					description : '',
					client : '',
					clientId: '',
                    clientName: '',
					timeStartDate : function() {
						var date = new Date();
						date.setHours(13);
						date.setMinutes(0);
						return date;
					}(),
					timeEndDate : function() {
						var date = new Date();
						date.setHours(20);
						date.setMinutes(0);
						return date;
					}(),
					days : [0, 1, 2, 3, 4, 5, 6],
					isRaid : false,
					isWeekly : false,
					isPaused: false,
					supervisions: 1,
                    taskType: 'Regular'
				},
				filledTemplate : function(object) {
					return {
						name : object.get('name'),
						description : object.get('Description'),
						client : ParseClient.getScopedObject(object.get('client')),
                        clientId : object.get('clientId'),
						clientName : object.get('clientName'),
						timeStartDate : object.get('timeStartDate'),
						timeEndDate : object.get('timeEndDate'),
						days : object.get('days'),
						isRaid : object.get('taskType') === 'Raid',
						isWeekly : !!object.get('isWeekly'),
						isPaused: !!object.get('isPaused'),
                        supervisions: object.get('supervisions'),
                        taskType : object.get('taskType')
					};
				}
			});


			return angular.extend(ParseObject, {
				getQuery : function(taskGroupPointer) {
					var query = ParseObject.fetchAllQuery();
					if (taskGroupPointer)
						query.equalTo('taskGroup', taskGroupPointer);
					query.notEqualTo('isExtra', true);
					query.include('client');
					return query;
				},
				sorting : {
					clientName : 'asc'
				}
			});
		}]);



app.factory('ParseTaskGroupStarted', [
		'StandardParseObject',
		function(StandardParseObject) {
			var ParseObject = new StandardParseObject({
				objectname : 'TaskGroupStarted',
				emptyTemplate : {
					name : '',
					taskGroup : '',
					guard : '',
					timeStarted : '',
					timeEnded : '',
					eventCount : ''
				},
				filledTemplate : function(object) {
					return {
						name : object.get('name'),
						taskGroup : object.get('taskGroup'),
						guard : object.get('guard'),
						timeStarted : object.get('timeStarted'),
						timeEnded : object.get('timeEnded'),
						eventCount : object.get('eventCount'),
						createdAt : object.createdAt
					};
				}
			});

			return angular.extend(ParseObject, {});
		}]);




app.factory('ParseReport', [
		'StandardParseObject', 'ParseTaskGroupStarted', 'ParseClient', 'ParseEventLog',
		function(StandardParseObject, ParseTaskGroupStarted, ParseClient, ParseEventLog) {
			var ParseObject = new StandardParseObject(
					{
						objectname : 'Report',
						emptyTemplate : {
							reportId : '',
                            taskTypeName: '',
							taskGroupStarted : '',
							task : '',
							client : '',
							clientName : '',
							clientAddress : '',
							clientAddressNumber : '',
                            clientFullAddress: '',
							clientCity : '',
							guardName : '',
							guardId : '',
							type : '',
							extraTimeSpent : '',
							position : '',
							isExtra : '',
							timeStartString : '',
							timeEndString : '',
							reportEntries : '',
							deviceTimestamp : '',
							headerLogo : '',
							eventLogs: []
						},
						filledTemplate : function(object) {
							return {
								reportId : object.get('reportId'),
                				taskTypeName : object.get('taskTypeName'),
								taskGroupStarted : ParseTaskGroupStarted.getScopedObject(object.get('taskGroupStarted')),
								taskGroupName : function() {
									var taskGroupStarted = ParseTaskGroupStarted.getScopedObject(object.get('taskGroupStarted'));
									return (taskGroupStarted && taskGroupStarted.name) ? taskGroupStarted.name : '';
								}(),
								task : object.get('task'),
								client : object.get('client'),
								clientName : object.get('clientName'),
								clientCity : object.get('clientCity'),
								clientAddress : object.get('clientAddress'),
								clientAddressNumber : object.get('clientAddressNumber'),
                                clientFullAddress : object.get('clientFullAddress'),
								guardName : object.get('guardName'),
								guardId : object.get('guardId'),
								type : object.get('type'),
								extraTimeSpent : object.get('extraTimeSpent'),
								position : object.get('position'),
								isExtra : object.get('isExtra'),
								timeStartString : object.get('timeStartString'),
								timeEndString : object.get('timeEndString'),
								reportEntries : object.get('reportEntries'),
								deviceTimestamp : object.get('deviceTimestamp'),
								headerLogo : function() {
									var owner = object.get('owner');
									if (owner && owner.has('logoUrl')) {
										return owner.get('logoUrl');
									}
									return '';
								}(),
								eventLogs : ParseEventLog.getScopedObjects(object.get('eventLogs'))
							};
						}
					});

			return angular.extend(ParseObject, {
				tasksQuery : function() {
					var regular = ParseObject.fetchAllQuery();
                    regular.equalTo('taskType', 'Regular');

                    var raid = ParseObject.fetchAllQuery();
                    raid.equalTo('taskType', 'Raid');

					return Parse.Query.or(regular, raid);
				},
				staticSupervisionQuery: function() {
					var query = ParseObject.fetchAllQuery();

					query.equalTo('taskType', 'Static');

					return query;
				},
                alarmsQuery: function() {
                    var query = ParseObject.fetchAllQuery();

                    query.equalTo('taskType', 'Alarm');

                    // Hide test alarms (for JVH)
					// Todo: create more generic method of filtering away test alarms
                    query.notEqualTo('client', ParseClient.getPointerObject('onA5zT2dqq'));

                    return query;
                }
			});
		}]);

app
		.factory(
				'ParseEventLog',
				[
						'StandardParseObject',
						function(StandardParseObject) {
							var ParseObject = new StandardParseObject(
									{
										objectname : 'EventLog',
										emptyTemplate : {
											taskGroupStarted : '',
											task : '',
											districtWatchStarted : '',
											client : '',
											contactClient : '',
											type : '',
											event : '',
											eventCode : '',
											amount : '',
											people : '',
											clientLocation : '',
											remarks : '',
											position : '',
											positionString : '',
											clientName : '',
											clientAddress : '',
											clientAddressNumber : '',
											clientCity : '',
											guardName : '',
											guardId : '',
											clientFullAddress : '',
											isExtra : false,
											timeStartString : '',
											timeEndString : '',
											clientTimestamp : '',
											deviceTimestamp : '',
											automatic : false
										},
										filledTemplate : function(eventlog) {
											return {
												taskGroupStarted : eventlog.get('taskGroupStarted'),
												task : eventlog.get('task'),
												districtWatchStarted : eventlog.get('districtWatchStarted'),
												client : eventlog.get('client'),
												contactClient : eventlog.get('contactClient'),
												type : eventlog.get('type'),
												event : eventlog.get('event'),
												eventCode : eventlog.get('eventCode'),
												amount : eventlog.get('amount'),
												people : eventlog.get('people'),
												clientLocation : eventlog.get('clientLocation'),
												remarks : eventlog.get('remarks'),
												position : eventlog.get('position'),
												positionString : (eventlog.get('position')) ? eventlog.get('position').latitude + ',' + eventlog.get('position').longitude : '',
												clientName : eventlog.get('clientName'),
												clientCity : eventlog.get('clientCity'),
												clientAddress : eventlog.get('clientAddress'),
												clientAddressNumber : eventlog.get('clientAddressNumber'),
												guardName : eventlog.get('guardName'),
												guardId : eventlog.get('guardId'),
												clientFullAddress : eventlog.get('clientFullAddress'),
												isExtra : eventlog.get('isExtra'),
												timeStartString : eventlog.get('timeStartString'),
												timeEndString : eventlog.get('timeEndString'),
												clientTimestamp : eventlog.get('clientTimestamp'),
												deviceTimestamp : eventlog.get('deviceTimestamp'),
												clientTimestampUnix :  moment(eventlog.get('clientTimestamp')).unix(),
												taskEvent : eventlog.get('task_event'),
												activityConfidence : eventlog.get('activityConfidence'),
												automatic : eventlog.get('automatic'),
												createdAt : eventlog.createdAt
											};
										}
									});


							return angular
									.extend(ParseObject, {
								excludeLoginLogout : function(query) {
									var eventCodes = [200, 201];
									query.notContainedIn('eventCode',
											eventCodes);
									return query;
								}
							});
						}]);

