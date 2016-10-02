'use strict';

var app = angular.module('GuardSwiftApp.services');


app.factory('ParseFactory' , [
             'ParseClient', 'ParseGuard', 'ParseGroup',
             'ParseEventType', 'ParseMessage',
             'ParseClientContact', 'ParseClientLocation',
             'ParseChecklistStart', 'ParseChecklistEnd',
             'ParseCircuit', 'ParseCircuitStarted', 'ParseCircuitUnit',
             'DistrictGroup', 'DistrictTask',
             'ParseAlarm', 'ParseReport', 'ParseEventLog', 'ParseGPSTracker',
             function(ParseClient, ParseGuard, ParseGroup,
                     ParseChecklistStart, ParseChecklistEnd,
                     ParseEventType, ParseMessage,
                     ParseClientContact, ParseClientLocation,
                     ParseCircuit, ParseCircuitStarted, ParseCircuitUnit,
					  DistrictGroup, ParseDistrictWatchStarted,
                     ParseAlarm, ParseReport, ParseEventLog, ParseGPSTracker) {

             var data = {
            		 'Client' : ParseClient,
            		 'Guard' : ParseGuard,
            		 'Group' : ParseGroup,
            		 'EventType' : ParseEventType,
            		 'Message' : ParseMessage,
            		 'ClientContact' : ParseClientContact,
            		 'ClientLocation' : ParseClientLocation,
            		 'ChecklistStart' : ParseChecklistStart,
            		 'ChecklistEnd' : ParseChecklistEnd,
            		 'Circuit' : ParseCircuit,
            		 'CircuitStarted' : ParseCircuitStarted,
            		 'CircuitUnit' : ParseCircuitUnit,
            		 'DistrictGroup' : DistrictGroup,
            		 'DistrictTask' : DistrictTask,
            		 'Alarm' : ParseAlarm,
            		 'Report' : ParseReport,
            		 'EventLog' : ParseEventLog,
            		 'GPSTracker' : ParseGPSTracker
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
				attrs : ['number', 'name', 'addressName', 'addressNumber',
						'cityName', 'zipcode', 'email', 'receiveEventEmail',
						'position', 'contacts', 'roomLocations', 'messages'],
				emptyTemplate : {
					number : undefined,
					name : '',
					addressName : '',
					addressNumber : '',
					cityName : '',
					zipcode : '',
					email : '',
					receiveEventEmail : false,
					position : new Parse.GeoPoint({latitude: 40.0, longitude: -30.0}),
					roomLocations : [],
					contacts : [],
					messages : []
				},
				filledTemplate : function(client) {
					return {
						number : client.getNumber(),
						name : client.getName(),
						addressName : client.getAddressName(),
						addressNumber : client.getAddressNumber(),
						cityName : client.getCityName(),
						zipcode : client.getZipcode(),
						email : client.getEmail(),
						receiveEventEmail : client.getReceiveEventEmail(),
						position : client.getPosition(),
						roomLocations : client.getRoomLocations(),
						contacts : client.getContacts(),
						messages : client.getMessages()
					};
				}
			});

			return angular.extend(ParseObject, {
				sorting : {
					name : 'asc'
				}
			});
		}]);

app.factory('ParseGuard', ['StandardParseObject',
		function(StandardParseObject) {
			var ParseObject = new StandardParseObject({
				objectname : 'Guard',
				attrs : ['guardId', 'name', 'accessStatic', 'accessRegular', 'accessDistrict'],
				emptyTemplate : {
					guardId : '',
					name : '',
                    accessStatic: true,
                    accessRegular: true,
                    accessDistrict: true
				},
				filledTemplate : function(guard) {
					return {
						guardId : guard.getGuardId(),
						name : guard.getName(),
                        accessStatic: guard.getAccessStatic(),
                        accessRegular: guard.getAccessRegular(),
                        accessDistrict: guard.getAccessDistrict()
					};
				}
			});

			return angular.extend(ParseObject, {
				sorting : {
					name : 'asc'
				}
			});
		}]);

app.factory('ParseGroup', ['StandardParseObject',
		function(StandardParseObject) {
			var ParseObject = new StandardParseObject({
				objectname : 'Group',
				attrs : ['name', 'responsible'],
				emptyTemplate : {
					name : '',
					responsible : false
				},
				filledTemplate : function(object) {
					return {
						name : object.getName(),
						responsible : object.getResponsible(),
						createdAt : object.createdAt
					};
				}
			});

			return angular.extend(ParseObject, {
				sorting : {
					name : 'asc'
				}
			});
		}]);


app.factory('ParseChecklistStart', ['StandardParseObject',
		function(StandardParseObject) {
			var ParseObject = new StandardParseObject({
				objectname : 'ChecklistCircuitStarting',
				attrs : ['item'],
				emptyTemplate : {
					item : ''
				},
				filledTemplate : function(checklist) {
					return {
						item : checklist.getItem()
					};
				}
			});

			return angular.extend(ParseObject, {

			});
		}]);

app.factory('ParseChecklistEnd', ['StandardParseObject',
		function(StandardParseObject) {
			var ParseObject = new StandardParseObject({
				objectname : 'ChecklistCircuitEnding',
				attrs : ['item'],
				emptyTemplate : {
					item : ''
				},
				filledTemplate : function(checklist) {
					return {
						item : checklist.getItem()
					};
				}
			});

			return angular.extend(ParseObject, {

			});
		}]);

app.factory('ParseEventType', ['StandardParseObject', 'ParseClient',
		function(StandardParseObject, ParseClient) {
			var ParseObject = new StandardParseObject({
				objectname : 'EventType',
				attrs : ['name', 'hasAmount', 'hasPeople', 'hasLocations', 'hasRemarks'],
				emptyTemplate : {
					name : '',
					hasAmount: true,
					hasPeople: true,
					hasLocations: true,
					hasRemarks: true
				},
				filledTemplate : function(event) {
					return {
						name : event.getName(),
						hasAmount: event.getHasAmount(),
						hasPeople: event.getHasPeople(),
						hasLocations: event.getHasLocations(),
						hasRemarks: event.getHasRemarks()
					};
				},
			});

			return angular.extend(ParseObject, {
				sorting : {
					name : 'asc'
				}
			});
		}]);

app.factory('ParseMessage', ['StandardParseObject',
		function(StandardParseObject) {
			var ParseObject = new StandardParseObject({
				objectname : 'Message',
				attrs : ['message', 'author'],
				emptyTemplate : {
					message : '',
					author : ''
				},
				filledTemplate : function(object) {
					return {
						message : object.getMessage(),
						author : object.getAuthor(),
						updatedAt : object.updatedAt,
						createdAt : object.createdAt
					};
				}
			});


			return angular.extend(ParseObject, {
			});
		}]);

app.factory('ParseClientContact', ['StandardParseObject',
		function(StandardParseObject) {

			var ParseObject = new StandardParseObject({
				objectname : 'ClientContact',
				attrs : ['name', 'desc', 'phoneNumber', 'email', 'receiveReports'],
				emptyTemplate : {
					name : '',
					desc : '',
					phoneNumber : '',
					email : '',
					receiveReports : false,
				},
				filledTemplate : function(object) {
					return {
						name : object.getName(),
						desc : object.getDesc(),
						phoneNumber : object.getPhoneNumber(),
						email : object.getEmail(),
						receiveReports : object.getReceiveReports() || false
					};
				}
			});

			return angular.extend(ParseObject, {
			});
		}]);

app.factory('ParseClientLocation', ['StandardParseObject',
		function(StandardParseObject) {

			var ParseObject = new StandardParseObject({
				objectname : 'ClientLocation',
				attrs : ['location', 'isCheckpoint'],
				emptyTemplate : {
					location : '',
					isCheckpoint : '',
				},
				filledTemplate : function(object) {
					return {
						location : object.getLocation(),
						isCheckpoint : object.getIsCheckpoint(),
					};
				}
			});

			return angular.extend(ParseObject, {
			});
		}]);

/**
 * PLANNING
 */

app.factory('ParseCircuit', [
		'StandardParseObject',
		function(StandardParseObject) {
			var ParseObject = new StandardParseObject({
				objectname : 'Circuit',
				attrs : ['name', 'timeStartDate', 'timeEndDate',
						'timeResetDate', 'days'],
				emptyTemplate : {
					name : '',
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
					timeResetDate : function() {
						var date = new Date();
						date.setHours(6);
						date.setMinutes(0);
						return date;
					}(),
					days : [0, 1, 2, 3, 4, 5, 6],
				},
				filledTemplate : function(object) {
					return {
						name : object.getName(),
						timeStartDate : object.getTimeStartDate(),
						timeEndDate : object.getTimeEndDate(),
						timeResetDate : object.getTimeResetDate(),
						days : object.getDays(),
					};
				}
			});

			return angular.extend(ParseObject, {
				sorting : {
					name : 'asc'
				}
			});
		}]);

app.factory('ParseCircuitUnit', [
		'StandardParseObject',
		'ParseClient',
		function(StandardParseObject, ParseClient) {
			var ParseObject = new StandardParseObject({
				objectname : 'CircuitUnit',
				attrs : ['name', 'description', 'client', 'timeStartDate',
						'timeEndDate', 'days', 'isRaid'],
				emptyTemplate : {
					name : '',
					description : '',
					client : '',
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
				},
				filledTemplate : function(object) {
					return {
						name : object.getName(),
						description : object.getDescription(),
						client : ParseClient.getScopedObject(object.getClient()),
						clientName : function() {
							var client = ParseClient.getScopedObject(object.getClient());
							return (client) ? client.name : '';
						}(),
						timeStartDate : object.getTimeStartDate(),
						timeEndDate : object.getTimeEndDate(),
						days : object.getDays(),
						isRaid : object.getIsRaid() || false,
					};
				}
			});


			return angular.extend(ParseObject, {
				getQuery : function(circuitPointer) {
					var query = ParseObject.fetchAllQuery();
					if (circuitPointer)
						query.equalTo('circuit', circuitPointer);
					query.notEqualTo('isExtra', true);
					query.include('client');
					return query;
				},
				sorting : {
					clientName : 'asc'
				}
			});
		}]);

app.factory('DistrictWatch', [
		'StandardParseObject',
		function(StandardParseObject) {
			var ParseObject = new StandardParseObject({
				objectname : 'TaskGroup',
				attrs : ['name',  'days', 'resetAt'],
				emptyTemplate : {
					name : '',
					resetAt : function() {
						var date = new Date();
						date.setHours(6);
						date.setMinutes(0);
						return date;
					}(),
					days : [0, 1, 2, 3, 4, 5, 6]

				},
				filledTemplate : function(object) {
					return {
						name : object.getName(),
						resetAt : object.getTimeResetDate(),
						days : object.getDays()
					};
				}
			});

			return angular.extend(ParseObject, {
			});
		}]);

//------------
// TASKS
//----

var TaskGroup = Object.freeze({
	objectname : 'TaskGroup',
	attrs : ['name', 'taskType', 'days', 'resetAt'],
	emptyTemplate: {
		name: '',
		taskType: '',
		days: [0, 1, 2, 3, 4, 5, 6],
		resetAt : function() {
			var date = new Date();
			date.setHours(6);
			date.setMinutes(0);
			return date;
		}()
	},
	filledTemplate: function(object) {
		return {
			name: object.getName(),
			taskType: object.getTaskType(),
			days: object.getDays(),
			resetAt: object.getResetAt(),
			createdAt : object.createdAt,
			updatedAt : object.updatedAt
		}
	}
});


//------------
// TASK GROUP STARTED
//----

var TaskGroupStarted = Object.freeze({
	objectname : 'TaskGroupStarted',
	// 'name', 'taskType', 'days', 'resetAt', 'owner'
	attrs : _.union(TaskGroup.attrs, []),
	emptyTemplate : _.extend({}, TaskGroup.emptyTemplate, {
		guard: {},
		timeStarted : new Date(),
		timeEnded : new Date()
	}),
	filledTemplate: function (object) {
		return _.extend({}, TaskGroup.filledTemplate(object), {
			guard: object.getGuard(),
			timeStarted: object.getTimeStarted(),
			timeEnded: object.getTimeEnded()
		})
	}
});


//------------
// TASK
//----

var Task = Object.freeze({
			objectname : 'Task',
			// 'taskType', 'days', '
			attrs : _.union(_.without(TaskGroupStarted.attrs, ['name', 'resetAt']), TaskGroupStarted.attrs, [
				'taskGroup',
				'taskGroupStarted',
				'placeObject',
				'placeId',
				'postalCode',
				'city',
				'street',
				'streetNumber',
				'formattedAddress',
				'position'
			]),
			emptyTemplate : _.extend({}, TaskGroupStarted.emptyTemplate, {
				taskGroup: '',
				taskGroupStarted: {},
				placeObject : {},
				placeId : '',
				postalCode : '',
				city : '',
				street : '',
				streetNumber : '',
				formattedAddress: '',
				position : new Parse.GeoPoint()
			}),
			filledTemplate : function(object) {
				return {
					taskGroup : object.getTaskGroup(),
					taskGroupStarted: object.getTaskGroupStarted(),
					placeObject : object.getPlaceObject(),
					placeId : object.getPlaceId(),
					formattedAddress: object.getFormattedAddress(),
					postalCode : object.getPostalCode(),
					ciry : object.getCity(),
					street : object.getStreet(),
					streetNumber: object.getStreetNumber(),
					position : object.getPosition()
				};
			}
		});




var createGroup = function(taskType, serviceName) {
	var group = {
		objectname : TaskGroup.objectname,
		attrs : _.union(TaskGroup.attrs, []),
		emptyTemplate: _.extend({}, TaskGroup.emptyTemplate, {
			taskType: taskType
		}),
		filledTemplate: function(object) {
			return _.extend({}, TaskGroup.filledTemplate(object), {

			})
		}
	};

	app.factory(serviceName, [
		'StandardParseObject',
		function(StandardParseObject) {
			var ParseObject = new StandardParseObject(group);

			return angular.extend(ParseObject, {
				getQuery : function(taskGroup) {
					var query = ParseObject.fetchAllQuery();
					if (taskGroup) {
						query.equalTo('taskGroup', taskGroup);
					}
					return query;
				}
			});
		}]);
};

var createGroupStarted = function(taskType, serviceName) {
	var groupStarted = {
		objectname : TaskGroupStarted.objectname,
		attrs : _.union(TaskGroupStarted.attrs, []),
		emptyTemplate: _.extend({}, TaskGroupStarted.emptyTemplate, {
			taskType: taskType
		}),
		filledTemplate: function(object) {
			return _.extend({}, TaskGroupStarted.filledTemplate(object), {

			})
		}
	};

	app.factory(serviceName, [
		'StandardParseObject',
		function(StandardParseObject) {
			var ParseObject = new StandardParseObject(groupStarted);

			return angular.extend(ParseObject, {
			});
		}]);
};

var createTask = function(taskType, serviceName, attrs, emptyTemplate, filledTemplate) {
	var task = {
		objectname : Task.objectname,
		attrs : _.union(Task.attrs, _.isArray(attrs) ? attrs : []),
		emptyTemplate: _.extend({}, Task.emptyTemplate, {
			taskType: taskType
		}, _.isObject(emptyTemplate) ? emptyTemplate : {}),
		filledTemplate: function(object) {
			return _.extend({}, Task.filledTemplate(object), _.isFunction(filledTemplate) ? filledTemplate(object) : {})
		}
	};

	app.factory(serviceName, [
		'StandardParseObject',
		function(StandardParseObject) {
			var ParseObject = new StandardParseObject(task);


			return angular.extend(ParseObject, {
				getQuery : function(taskGroup) {
					var query = ParseObject.fetchAllQuery();
					if (taskGroup) {
						query.equalTo('taskGroup', taskGroup);
					}
					return query;
				}
			});
		}]);
};


var TaskTypes = {
	DISTRICT : 'District'
};

//--------------
// DISTRICT
//--------------

createGroup(TaskTypes.DISTRICT, 'DistrictGroup');
createGroupStarted(TaskTypes.DISTRICT, 'DistrictGroupStarted');
createTask(TaskTypes.DISTRICT, 'DistrictTask',
	['supervisions', 'days'],
	{
		supervisions: 1,
		days: [0, 1, 2, 3, 4, 5, 6]
	}, function(task) {
		return {
			supervisions: task.getSupervisions(),
			days: task.getDays()
		}
	});


app.factory('ParseCircuitStarted', [
		'StandardParseObject',
		function(StandardParseObject) {
			var ParseObject = new StandardParseObject({
				objectname : 'CircuitStarted',
				attrs : ['name', 'circuit', 'guard', 'timeStarted',
						'timeEnded', 'eventCount'],
				emptyTemplate : {
					name : '',
					circuit : '',
					guard : '',
					timeStarted : '',
					timeEnded : '',
					eventCount : ''
				},
				filledTemplate : function(object) {
					return {
						name : object.getName(),
						circuit : object.getCircuit(),
						guard : object.getGuard(),
						timeStarted : object.getTimeStarted(),
						timeEnded : object.getTimeEnded(),
						eventCount : object.getEventCount(),
						createdAt : object.createdAt
					};
				}
			});

			return angular.extend(ParseObject, {
			});
		}]);

app.factory('ParseDistrictWatchStarted', [
		'StandardParseObject',
		function(StandardParseObject) {
			var ParseObject = new StandardParseObject({
				objectname : 'DistrictWatchStarted',
				attrs : ['name', 'districtWatch', 'guard', 'timeStarted',
						'timeEnded', 'eventCount'],
				emptyTemplate : {
					name : '',
					districtWatch : '',
					guard : '',
					timeStarted : '',
					timeEnded : '',
					eventCount : ''
				},
				filledTemplate : function(object) {
					return {
						name : object.getName(),
						districtWatch : object.getDistrictWatch(),
						guard : object.getGuard(),
						timeStarted : object.getTimeStarted(),
						timeEnded : object.getTimeEnded(),
						eventCount : object.getEventCount(),
						createdAt : object.createdAt
					};
				}
			});

			return angular.extend(ParseObject, {
			});
		}]);

app.factory('ParseAlarm', [
		'StandardParseObject',
		'$routeSegment',
		function(StandardParseObject, $routeSegment) {
			var ParseObject = new StandardParseObject({
				objectname : 'Alarm',
				attrs : ['securityLevel', 'clientName', 'clientCity',
						'clientAddress', 'clientFullAddress', 'client',
						'guard', 'alarmTime', 'timeAccepted',
						'timeStartedDriving', 'timeStarted', 'timeEnded',
						'eventCount', 'report', 'installer',
						'installer_company'],
				emptyTemplate : {
					securityLevel : '',
					clientName : '',
					clientCity : '',
					clientAddress : '',
					clientFullAddress : '',
					client : '',
					guard : '',
					alarmTime : '',
					timeAccepted : '',
					timeStartedDriving : '',
					timeStarted : '',
					timeEnded : '',
					eventCount : '',
					report : '',
					installer : '',
					installer_company : ''
				},
				filledTemplate : function(object) {
					return {
						securityLevel : object.getSecurityLevel(),
						clientName : object.getClientName(),
						clientCity : object.getClientCity(),
						clientAddress : object.getClientAddress(),
						clientFullAddress : object.getClientFullAddress(),
						client : object.getClient(),
						guard : object.getGuard(),
						alarmTime : object.getAlarmTime(),
						timeAccepted : object.getTimeAccepted(),
						timeStartedDriving : object.getTimeStartedDriving(),
						timeStarted : object.getTimeStarted(),
						timeEnded : object.getTimeEnded(),
						reactionTime : diffMinutes(object.getTimeAccepted(),
								object.getTimeStarted()),
						eventCount : object.getEventCount(),
						report : object.getReport(),
						installer : object.getInstaller(),
						installerName : (object.getInstaller_company())
								? object.getInstaller_company().get('name')
								: object.getInstaller(),
						installer_company : object.getInstaller_company(),
						createdAt : object.createdAt
					};
				}
			});

			return angular.extend(ParseObject, {
				getScopedObjectFromId : function() {
					return ParseObject.get($routeSegment.$routeParams.id, [
							'client', 'installer_company']);
				}
			});
		}]);

var diffMinutes = function(date1, date2) {
	if (!date1 || !date2) {
		return 0;
	}
	var timeDiff = Math.abs(date2.getTime() - date1.getTime());
	var diffMinutes = Math.ceil(timeDiff / (1000 * 60));
	return diffMinutes;
}

app.factory('ParseReport', [
		'StandardParseObject', 'ParseCircuitStarted', 'ParseDistrictWatchStarted', 'ParseEventLog',
		function(StandardParseObject, ParseCircuitStarted, ParseDistrictWatchStarted, ParseEventLog) {
			var ParseObject = new StandardParseObject(
					{
						objectname : 'Report',
						attrs : ['reportId', 'taskTypeName', 'circuitStarted', 'circuitUnit',
								'districtWatchStarted', 'alarm', 'client',
								'clientName', 'clientAddress',
								'clientAddressNumber', 'clientCity', 'guardId',
								'guardName', 'type', 'extraTimeSpent',
								'position', 'clientName', 'isExtra',
								'timeStartString', 'timeEndString',
								'reportEntries', 'deviceTimestamp', 'headerLogo', 'eventLogs'],
						emptyTemplate : {
							reportId : '',
                            taskTypeName: '',
							circuitStarted : '',
							circuitUnit : '',
							districtWatchStarted : '',
							alarm : '',
							client : '',
							clientName : '',
							clientAddress : '',
							clientAddressNumber : '',
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
								reportId : object.getReportId(),
                				taskTypeName : object.getTaskTypeName(),
								circuitStarted : ParseCircuitStarted.getScopedObject(object.getCircuitStarted()),
								circuitName : function() {
									var circuitStarted = ParseCircuitStarted.getScopedObject(object.getCircuitStarted());
									return (circuitStarted && circuitStarted.name) ? circuitStarted.name : '';
								}(),
								circuitUnit : object.getCircuitUnit(),
								districtWatchStarted : object.getDistrictWatchStarted(),
								districtName : function() {
									var districtWatchStarted = ParseDistrictWatchStarted.getScopedObject(object.getDistrictWatchStarted());
									return (districtWatchStarted && districtWatchStarted.name) ? districtWatchStarted.name : '';
								}(),
								alarm : object.getAlarm(),
								client : object.getClient(),
								clientName : object.getClientName(),
								clientCity : object.getClientCity(),
								clientAddress : object.getClientAddress(),
								clientAddressNumber : object
										.getClientAddressNumber(),
								guardName : object.getGuardName(),
								guardId : object.getGuardId(),
								type : object.getType(),
								extraTimeSpent : object.getExtraTimeSpent(),
								position : object.getPosition(),
								isExtra : object.getIsExtra(),
								timeStartString : object.getTimeStartString(),
								timeEndString : object.getTimeEndString(),
								reportEntries : object.getReportEntries(),
								deviceTimestamp : object.getDeviceTimestamp(),
								headerLogo : function() {
									var owner = object.get('owner');
									if (owner && owner.has('logoUrl')) {
										console.log(owner.get('logoUrl'));
										return owner.get('logoUrl');
									}
									return '';
								}(),
								eventLogs : ParseEventLog.getScopedObjects(object.getEventLogs())
							};
						}
					});

			return angular.extend(ParseObject, {
				districtWatchQuery : function() {
					var query = ParseObject.fetchAllQuery();

					query.exists('districtWatchStarted');

					query.include('districtWatchStarted');

					return query;
				},
				circuitUnitsQuery : function() {
					var query = ParseObject.fetchAllQuery();

					query.exists('circuitStarted');
					query.exists('circuitUnit');

					query.include('circuitStarted');

					return query;
				},
				staticSupervisionQuery: function() {
					var query = ParseObject.fetchAllQuery();

					query.equalTo('taskTypeName', 'STATIC');

					return query;
				},
				alarmsQuery : function() {
					var query = ParseObject.fetchAllQuery();
					query.exists('alarm');
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
										attrs : ['circuitStarted',
												'circuitUnit',
												'districtWatchStarted',
												'alarm', 'client',
												'contactClient', 'type',
												'event', 'eventCode', 'amount', 'people',
												'clientLocation', 'remarks',
												'position', 'clientName',
												'clientAddress',
												'clientAddressNumber',
												'clientCity', 'guardName',
												'guardId', 'clientFullAddress',
												'isExtra', 'timeStartString',
												'timeEndString',
												'clientTimestamp',
												'deviceTimestamp',
												'gpsSummary', 'eventSummary', 'task_event', 'activityConfidence', 'automatic'],
										emptyTemplate : {
											circuitStarted : '',
											circuitUnit : '',
											districtWatchStarted : '',
											alarm : '',
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
											gpsSummary : '',
											eventSummary : '',
											automatic : false
										},
										filledTemplate : function(eventlog) {
											return {
												circuitStarted : eventlog
														.getCircuitStarted(),
												circuitUnit : eventlog
														.getCircuitUnit(),
												districtWatchStarted : eventlog
														.getDistrictWatchStarted(),
												alarm : eventlog.getAlarm(),
												client : eventlog.getClient(),
												contactClient : eventlog
														.getContactClient(),
												type : eventlog.getType(),
												event : eventlog.getEvent(),
												eventCode : eventlog
														.getEventCode(),
												amount : eventlog.getAmount(),
												people : eventlog.getPeople(),
												clientLocation : eventlog
														.getClientLocation(),
												remarks : eventlog.getRemarks(),
												position : eventlog
														.getPosition(),
												positionString : (eventlog
														.getPosition())
														? eventlog
																.getPosition().latitude
																+ ','
																+ eventlog
																		.getPosition().longitude
														: '',
												clientName : eventlog
														.getClientName(),
												clientCity : eventlog
														.getClientCity(),
												clientAddress : eventlog
														.getClientAddress(),
												clientAddressNumber : eventlog
														.getClientAddressNumber(),
												guardName : eventlog
														.getGuardName(),
												guardId : eventlog.getGuardId(),
												clientFullAddress : eventlog
														.getClientFullAddress(),
												isExtra : eventlog.getIsExtra(),
												timeStartString : eventlog
														.getTimeStartString(),
												timeEndString : eventlog
														.getTimeEndString(),
												clientTimestamp : eventlog
														.getClientTimestamp(),
												deviceTimestamp : eventlog.getDeviceTimestamp(),
												clientTimestampUnix :  moment(eventlog.getClientTimestamp()).unix(),
												taskEvent : eventlog.getTask_event(),
												gpsSummary : eventlog
														.getGpsSummary(),
												eventSummary : eventlog
														.getEventSummary(),
												activityConfidence : eventlog.getActivityConfidence(),
												automatic : eventlog.getAutomatic(),
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

app.factory('ParseGPSTracker', [
		'StandardParseObject',
		function(StandardParseObject) {
			var ParseObject = new StandardParseObject({
				objectname : 'GPSTracker',
				attrs : ['installation', 'guard', 'gpsData', 'sampleStart',
						'sampleEnd'],
				emptyTemplate : {
					installation : '',
					guard : '',
					gpsData : [],
					minutesSampled : 0,
					sampleStart : '',
					sampleEnd : ''
				},
				filledTemplate : function(object) {
					return {
						name : object.getInstallation(),
						guardName : (object.getGuard()) ? object.getGuard()
								.get('name') : '',
						gpsData : object.getGpsData(),
						sampleStart : object.getSampleStart(),
						sampleEnd : object.getSampleEnd(),
						/*
						 * fromTime : function() { var MS_PER_MINUTE = 60000;
						 * return new Date(object.createdAt -
						 * object.getMinutesSampled() MS_PER_MINUTE); }(),
						 * toTime : object.createdAt,
						 */
						createdAt : object.createdAt
					};
				}
			});

			return angular.extend(ParseObject, {
			});
		}]);
