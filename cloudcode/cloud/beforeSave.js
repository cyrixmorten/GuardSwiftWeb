var _ = require('underscore');
var Static = require("cloud/static.js");
var Mailing = require("cloud/mailing.js");

//** SETUP NEW
Parse.Cloud.beforeSave("_User", function(request, response) {
	var user = request.object;
	if (!user.has('broadcast_alarms')) {
		user.set('broadcast_alarms', false);
	}
	if (!user.has('totalSavedEvents')) {
		user.set('totalSavedEvents', 0);
	}
	if (!user.has('paidEvents')) {
		user.set('paidEvents', 1000)
	}
    response.success();
});

var updateLogACL = function(request) {

	Parse.Cloud.useMasterKey();

	if (request.object.isNew()) {
		var acl = new Parse.ACL();
		acl.setPublicReadAccess(true);
		acl.setPublicWriteAccess(false);
		if (request.user) {
			acl.setReadAccess(request.user.id, true)
			acl.setWriteAccess(request.user.id, true)
		}
		request.object.setACL(acl);
	}
};

Parse.Cloud.beforeSave("Report", function(request, response) {

	updateLogACL(request);

	Parse.Cloud.useMasterKey();

	var Report = request.object;

	if (Report.isNew()) {
		var columnName = "";
		if (Report.has('alarm'))
			columnName = "alarmReports";
		if (Report.has('staticTask'))
				columnName = "staticTaskReports";
		if (Report.has('circuitUnit'))
			columnName = "regularReports";



		if (columnName) {
			incrementUsageCount(request, [columnName, "reports"]).then(function() {
				response.success();
			});
		}
	} else {
		response.success();
	}
});

Parse.Cloud.beforeSave("GPSTracker", function(request, response) {

	Parse.Cloud.useMasterKey();

	if (request.object.isNew()) {
		return incrementUsageCount(request, 'gpsTracker').then(function() {
			response.success();
		})
	} else {
		response.success();
	}

});

var incrementUsageCount = function(request, columnNames) {
	var User = request.user;
	if (User) {
		// to accept single string arguments
		var columnNamesArray = [].concat(columnNames);
		for (i=0; i<columnNamesArray.length; ++i) {
			User.increment(columnNamesArray[i]);
		}
		return User.save();
	} else {
		console.error('incrementUsageCount - missing user');
		return new Parse.Promise.error('missing user');
	}

}

var timeStringHour = function(timeString) {
	if (timeString.indexOf('.') != -1) {
		return parseInt(timeString.substring(0, timeString.indexOf('.')));
	} else {
		return parseInt(timeString);
	}
};

var timeStringMinute = function(timeString) {
	if (timeString.indexOf('.') != -1) {
		return parseInt(timeString.substring(timeString.indexOf('.') + 1));
	} else {
		return 0;
	}
};

// TODO export as module
var pushPinUpdate = function(pin, request) {

	console.log("Push on pin " + pin);

	if (!request || !request.user || !request.object) {
		var msg = "";
		if (!request)
			msg = "missing request";
		else if (!request.user)
			msg = "missing user";
		else if (!request.object)
			msg = "missing object";

		console.log("Push cancel on pin " + pin + " " + msg);

		return new Parse.Promise.error(msg);
	}

	var user = request.user;
	var parseObject = request.object;
	var installationId = request.installationId;

	Parse.Cloud.useMasterKey();

	var allInstallations = new Parse.Query(Parse.Installation);
	allInstallations.equalTo('owner', user);
	if (installationId) {
		// exluding installationId
		console.log("excluding installationId	: " + installationId);
		allInstallations.notEqualTo('installationId', installationId);
	} else {
		console.log("missing installationId: " + installationId);
	}
	return Parse.Push.send({
		where : allInstallations,
		expiration_interval : 600,
		data : {
			action : "com.guardswift.UPDATE_SERVERDATA",
			pin : pin,
			object : parseObject
		}
	});
};

Parse.Cloud.beforeSave("CircuitStarted", function(request, response) {
	Parse.Cloud.useMasterKey();
	var CircuitStarted = request.object;
	if (CircuitStarted.isNew()) {
		request.user = CircuitStarted.get('owner');
		pushPinUpdate("CircuitStarted", request).then(function() {
			console.log("Pushed new CircuitStarted");
			response.success();
		}, function(error) {
			console.error("Failed to CircuitStarted push error: ");
			console.error(error);
			response.success();
		});
	} else {
		response.success();
	}
});

Parse.Cloud.beforeSave("Alarm", function(request, response) {

	var Alarm = request.object;

	if (Alarm.get('aborted')) {
		console.log("-- aborted --");
		var guard = Alarm.get('guard');
		Alarm.unset('ignoredBy');
		Alarm.addUnique('ignoredBy', guard);
	}


	response.success();

});

// var newCircuitStartedMail = function(circuitStarted) {
// var promise = new Parse.Promise();
//
// var circuitName = circuitStarted.get('name');
// var timeString = new Date().toLocaleTimeString();
// var User = circuitStarted.get('owner');
// var Circuit = circuitStarted.get('circuit');
// User.fetch().then(function(user) {
// Circuit.fetch().then(function(circuit) {
// var subject = "Ny kreds oprettet " + circuitName;
// var msg = "User: " + user.get('username') + "\n";
// msg += "Servertime: " + timeString + "\n";
// msg += "Circuit timesStart " + circuit.get('timeStart') + "\n";
// msg += "Circuit timesEnd " + circuit.get('timeEnd');
//
// Mailing.sendTextEmail("cyrixmorten@gmail.com", subject, msg).then(function()
// {
// promise.resolve();
// }, function(error) {
// console.log("Send mail: " + error.message);
// promise.error(error.message);
// });
//
// }, function(error) {
// console.log("Fetch circuit: " + error.message);
// promise.error(error.message);
// });
// }, function(error) {
// console.log("Fetch user: " + error.message);
// promise.error(error.message);
// });
//
// return promise;
// };

Parse.Cloud.beforeSave("EventLog", function(request, response) {
	updateLogACL(request);

	var EventLog = request.object;

	// avoid 'undefined' for automatic
	var automatic = EventLog.get('automatic');
	if (!automatic) {
		EventLog.set('automatic', false);
	}


	response.success();
});

/*
 * Auto set timesUsed to 0 if not defined
 */
Parse.Cloud.beforeSave("EventType", function(request, response) {
	var EventType = request.object;

	var timesUsed = EventType.get('timesUsed');
	if (!timesUsed) {
		var timesUsedCount = (EventType.has('client')) ? 1000 : 0;
		EventType.set('timesUsed', timesUsedCount);
	} else {
		EventType.increment('timesUsed');
	}

	response.success();
});

Parse.Cloud.beforeSave("CircuitUnit", function(request, response) {
	Parse.Cloud.useMasterKey();

	var CircuitUnit = request.object;

	// Set default values
	if (!CircuitUnit.has('highPriority')) {
		CircuitUnit.set('highPriority', false);
	}

	if (!CircuitUnit.has('timeStarted')) {
		CircuitUnit.set('timeStarted', new Date(1970));
	}

	if (!CircuitUnit.has('timeEnded')) {
		CircuitUnit.set('timeEnded', new Date(1970));
	}

	// inherit client position
	var clientPointer = CircuitUnit.get('client');
	if (clientPointer) {
		clientPointer.fetch().then(function(client) {
			CircuitUnit.set('clientPosition', client.get('position'));
			response.success();
		}, function(error) {
			console.error("error at clientPointer " + error.message);
			response.success();
		});
	} else {
		response.success();
	}

});

Parse.Cloud
		.beforeSave(
				"DistrictWatchClient",
				function(request, response) {
					Parse.Cloud.useMasterKey();

					var DistrictWatchClient = request.object;

					var DistrictWatchUnit = DistrictWatchClient
							.get('districtWatchUnit');

					DistrictWatchUnit
							.fetch()
							.then(
									function(districtWatchUnit) {
										var ResponsibleClient = districtWatchUnit
												.get('client');

										DistrictWatchClient.set('supervisions', districtWatchUnit.get('supervisions'));
										DistrictWatchClient.set('days', districtWatchUnit.get('days'));

										if (!DistrictWatchClient.has('completed'))
											DistrictWatchClient.set('completed', false)

//										ResponsibleClient
//												.fetch()
//												.then(
//														function(responsibleClient) {
//															DistrictWatchClient
//																	.set(
//																			'clientName',
//																			responsibleClient
//																					.get('name'));

															var addressName = DistrictWatchClient
																	.get("addressName");
															var addressNumber = DistrictWatchClient
																	.get("addressNumber");
															var zipcode = DistrictWatchClient
																	.get("zipcode");
															var cityName = DistrictWatchClient
																	.get("cityName");

															DistrictWatchClient
																	.set(
																			'fullAddress',
																			addressName
																					+ " "
																					+ addressNumber);

															var searchAddress = addressName
																	+ " "
																	+ addressNumber
																	+ ","
																	+ zipcode
																	+ " "
																	+ cityName;

															if (addressName.length == 0) {
																response
																		.error("Address must not be empty");
															} else if (zipcode == 0) {
																if (cityName.length == 0) {
																	response
																			.error("Zipcode and city name must not be empty");
																}
															} else {
																lookupAddress(
																		searchAddress)
																		.then(
																				function(point) {

																					DistrictWatchClient
																							.set(
																									"position",
																									point);

																					response
																							.success();
																				},
																				function(error) {
																					response
																							.error("Address not found: "
																									+ searchAddress);
																				});
															};
//														},
//														function(error) {
//															response
//																	.error("ResponsibleClient not found: "
//																			+ searchAddress);
//														});
									}, function(error) {
										console.error('missing districtWatchUnit');
										DistrictWatchClient.destroy();
										response.success();
									});

				});

/*
 * Sanity check and obtain a GPS position for Client
 */
Parse.Cloud.beforeSave("Client", function(request, response) {
	Parse.Cloud.useMasterKey();

	var Client = request.object;

	var dirtyKeys = Client.dirtyKeys();
	var lookupAddress = false;
	var addressKeys = ["cityName", "zipcode", "addressName", "addressNumber"]
	for (dirtyKey in dirtyKeys) {
		var dirtyValue = dirtyKeys[dirtyKey];
		if (_.contains(addressKeys, dirtyValue)) {
			lookupAddress = true;
		}
		console.log(dirtyValue + ": " + lookupAddress);
	}

	if (lookupAddress) {
		console.log("do addAddressToClient");
		addAddressToClient(Client, response);


//			var CircuitUnit = Parse.Object.extend("CircuitUnit");
//			var query = new Parse.Query(CircuitUnit);
//			query.equalTo('client', Client);
//
//			query.each(function(object) {
//				console.log('updating circuitunit');
//				return object.save();
//			}).then(function() {
//				console.log('circuitunits updated');
//				// pushPinUpdate(Pins.CIRCUIT_UNITS, request);
//			}, function(err) {
//				console.error(err.message);
//			});
	} else {
		console.log("no address lookup");
		response.success();
	}

//	response.success();


});

var addAddressToClient = function(Client, response) {

	var addressName = Client.get("addressName");
	var addressNumber = Client.get("addressNumber");
	var zipcode = Client.get("zipcode");
	var cityName = Client.get("cityName");

	Client.set('fullAddress', addressName + " " + addressNumber);

	var searchAddress = addressName + " " + addressNumber + "," + zipcode + " "
			+ cityName;

	if (addressName.length == 0) {
		response.error("Address must not be empty");
	} else if (zipcode == 0) {
		if (cityName.length == 0) {
			response.error("Zipcode and city name must not be empty");
		}
	} else {
		lookupAddress(searchAddress).then(function(point) {

			Client.set("position", point);

			console.log('setting new position:');
			console.log(point);

			response.success();
		}, function(error) {
			response.error("Address not found: " + searchAddress);
		});
	};
};

/*
 * Sanity check and obtain a GPS position for first addressNumber
 */
Parse.Cloud
		.beforeSave(
				"DistrictWatchUnit",
				function(request, response) {
					Parse.Cloud.useMasterKey();

					var unit = request.object;

					var addressName = unit.get("address");
					var addressNumbers = unit.get("addressNumbers");

					if (addressName.length == 0) {
						response.error("Address must not be empty");
					}

					if (addressNumbers.length == 0) {
						response.error("Streetnumbers must not be empty");
					}

					var DistrictWatch = unit.get('districtWatch');

					DistrictWatch
							.fetch()
							.then(
									function(districtWatch) {

										var zipcode = districtWatch
												.get("zipcode");
										var cityName = districtWatch
												.get("city");

										var searchAddress = addressName + " "
												+ addressNumbers[0] + ","
												+ zipcode + " " + cityName;

										if (zipcode == 0) {
											if (cityName.length == 0) {
												response
														.error("Zipcode and city name must not be empty");
											}
										} else {
											lookupAddress(searchAddress)
													.then(
															function(point) {
																unit
																		.set(
																				"position",
																				point);
																if (unit
																		.isNew()) {
																	response
																			.success();
																} else {
																	var DistrictWatchClient = Parse.Object
																			.extend("DistrictWatchClient");
																	var cleanUpQuery = new Parse.Query(
																			DistrictWatchClient);
																	cleanUpQuery
																			.equalTo(
																					'districtWatchUnit',
																					unit);
																	cleanUpQuery
																			.each(
																					function(object) {
																						// remove
																						// all
																						// earlier
																						// associated
																						// DistrictWatchClient's
																						return object
																								.destroy();
																					})
																			.then(
																					function() {
																						response
																								.success();
																					},
																					function(error) {
																						console
																								.error(error.message);
																						response
																								.error(error.message);
																					});
																}
															},
															function(error) {
																response
																		.error("Address not found: "
																				+ searchAddress);
															});
										};
									}, function(error) {
										console.error(error.message);
										console.error(DistrictWatch);
										unit.set("invalidPointer", true)
										response.success();
									});

				});

var lookupAddress = function(searchAddress) {
	var promise = new Parse.Promise();
	Parse.Cloud.httpRequest({
		url : 'https://maps.googleapis.com/maps/api/geocode/json',
		params : {
			address : searchAddress,
			key : Static.GOOGLE_GEOCODE_API_KEY
		},
		success : function(httpResponse) {
			var data = httpResponse.data;
			if (data.status == "OK") {

				var latlng = data.results[0].geometry.location;

				var lat = latlng.lat;
				var lng = latlng.lng;

				var point = new Parse.GeoPoint({
					latitude : lat,
					longitude : lng
				});

				promise.resolve(point);

			} else {
				console.error(httpResponse);
				promise.reject("Failed to locate coordinate for : "
						+ searchAddress);
			};

		},
		error : function(httpResponse) {
			promise.reject(httpResponse);
			console.error(httpResponse);
		}
	});
	return promise;
};
