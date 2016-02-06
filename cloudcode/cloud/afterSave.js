var Mailing = require("cloud/mailing.js");

var Pins = {
	ALARM : "Alarm",
	EVENT_TYPES : "EventType",
	CLIENTS : "Client",
	DISTRICTWATCH : "DistrictWatch",
	DISTRICTWATCH_UNIT : "DistrictWatchUnit",
	DISTRICTWATCHS_CLIENT : "DistrictWatchClient",
	CIRCUITS : "Circuit",
	CIRCUITSTARTED : "CircuitStarted",
	CIRCUIT_UNITS : "CircuitUnit",
	GUARDS : "Guard",
	CLIENTINFO : "ClientInfo",
	CLIENTEVENTS : "ClientEvent",
	CHECKLISTS : "Checklists",
	EVENTLOGS : "Eventlogs"
};

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

		return;
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
	Parse.Push.send({
		where : allInstallations,
		expiration_interval : 600,
		data : {
			action : "com.guardswift.UPDATE_SERVERDATA",
			pin : pin,
			object : parseObject
		}
	}).then(function() {
		// success
		console.log("push success");
	}, function(error) {
		console.error(error.message);
	});
};

var pushNewAlarm = function(alarm) {

	Parse.Cloud.useMasterKey();

	var promise = new Parse.Promise();

	alarm.get('owner').fetch().then(function(user) {

		if (!user.get('broadcast_alarms')) {
			// locate responsible group
			console.log('locating responsible alarmgroup');

			var query = new Parse.Query("AlarmGroup");
			query.equalTo('owner', user);
			return query.find();
		} else {
			// no need to enforce additional restrictions on query
			return new Parse.Promise.as([]);
		}

	}).then(function(alarmGroups) {

		console.log("found alarmGroups: " + alarmGroups.length);

		var installationQuery = new Parse.Query(Parse.Installation);
		installationQuery.equalTo('owner', alarm.get('owner'));

		var responsibleGroups = [];
		alarmGroups.forEach(function(alarmGroup) {
			var responsible = alarmGroup.get('responsible');
			var name = alarmGroup.get('name');
			if (responsible) {
				console.log('found responsible group: ' + name);
				responsibleGroups.push(name);
			}
		});

		if (responsibleGroups.length != 0) {
			installationQuery.containedIn('alarmGroupName', responsibleGroups);
		}

		return new Parse.Promise.as(installationQuery);
	}).then(function(installationQuery) {
		Parse.Push.send({
			where : installationQuery,
			expiration_interval : 600,
			data : {
				action : "com.guardswift.NEW_ALARM"
			// object : alarm
			}
		}).then(function() {
			// success
			console.log("push success");
			promise.resolve();
		}, function(error) {
			console.error(error.message);
			promise.reject(error);
		});
	}, function(error) {
		console.error(error.message);
	});



	return promise;
};

Parse.Cloud.afterSave("Alarm", function(request) {

	var Alarm = request.object;

//	if (Alarm.get('aborted')) {
//		pushNewAlarm(Alarm);
//		return;
//	}

	var Central = Alarm.get('central');
	if (!Central) {
		console.error("missing central");
	} else {

		// Central.fetch().then(
		// function(Central) {
		if (!Alarm.get('accepted')) {
			if (Alarm.has('ignoredBy')) {
				console.log("ignored");
				return;
			}

			if (Alarm.get('global_received'))
				return;

			pushNewAlarm(Alarm).then(
					function() {
						sendResponseToCentralPointer(Central, Alarm,
								central_responses.RECEIVED).then(function() {
							console.log("SETTING GLOBAL RECEIVED");
							Alarm.set('global_received', true);
							Alarm.save();
						});
					}, function(error) {
						console.error(error);
					});

		} else {

			var timeStart = Alarm.get("timeStarted");
			var timeEnd = Alarm.get("timeEnded");
			if (!timeStart && !timeEnd) {

				if (Alarm.get('global_accepted'))
					return;

				// accepted
				sendResponseToCentralPointer(Central, Alarm,
						central_responses.ACCEPTED).then(function() {
					console.log("SETTING GLOBAL ACCEPTED");
					Alarm.set('global_accepted', true);
					Alarm.save();
				});
			} else if (timeStart && !timeEnd) {

				if (Alarm.get('global_arrived'))
					return;

				// arrived
				sendResponseToCentralPointer(Central, Alarm,
						central_responses.ARRIVED).then(function() {
					console.log("SETTING GLOBAL ARRIVED");
					Alarm.set('global_arrived', true);
					Alarm.save();
				});
			} else if (timeStart && timeEnd) {

				if (Alarm.get('global_closed'))
					return;

				// closed
				sendResponseToCentralPointer(Central, Alarm,
						central_responses.CLOSED).then(function() {
					console.log("SETTING GLOBAL CLOSED");
					Alarm.set('global_closed', true);
					Alarm.save();
				});
			}

			request.user = Alarm.get('owner');
			pushPinUpdate(Pins.ALARM, request);
		}
		// });
	}

});

var central_responses = {
	RECEIVED : 'SMODT',
	ACCEPTED : 'VMODT',
	ARRIVED : 'VANK',
	CLOSED : 'VAFSL',
	EVENT : 'INFO'
};

var sendResponseToCentralPointer = function(centralPointer, Alarm, central_response, optional_text) {
	var promise = new Parse.Promise.as();
	promise = promise.then(function() {
		centralPointer.fetch().then(
				function(Central) {
					return sendResponseToCentral(Central, Alarm,
							central_response, optional_text);
				});
	});
	return promise;
}
var sendResponseToCentral = function(Central, Alarm, central_response, optional_text) {

	if (Central.get('alarmDoNotReply')) {
		console
				.log("alarmDoNotReply is set to true for "
						+ Central.get("name"));
		return;
	}

	var response_subject = central_response;
	var response_text = /*central_response
			+ */((optional_text) ? /*"\n\n" +*/ optional_text : central_response);

//	console.log("Send response " + response_subject + " to central "
//			+ Central.get('name'));

	// curl --data
	// "to=guard@rr.dk&fromName=N51&subject=N51390296&host=62.242.106.204&port=25"
	// http://guardswift.com/mailing/response.php

	return Parse.Cloud.httpRequest({
		method : 'POST',
		url : 'http://guardswift.com/mailing/response.php',
		headers : {
			'Content-type' : 'application/x-www-form-urlencoded'
		},
		body : {
			to : Central.get('alarmReplyTo'),
			fromName : Alarm.get('hardwareId'),
			subject : response_subject,
			host : Central.get('smtp_host'),
			port : Central.get('smtp_port'),
			text : response_text,
		},
		success : function(httpResponse) {
			console.log("Success");
			console.log(httpResponse.text);
		},
		error : function(httpResponse) {
			console.error('Request failed with response code '
					+ httpResponse.status);
			console.error(httpResponse.text);
		}
	});

	// subject + "@rr.dk"
	// return Mailing.sendTextEmail("cyrixmorten@gmail.com",
	// "cyrixmorten@gmail.com", subject, text);
};

Parse.Cloud.afterSave("Circuit", function(request) {
	var Circuit = request.object;
	if (!Circuit.has('createdDay')) {
		console.log("Create new circuitStarted");
		Parse.Cloud.run("createCircuitStarted", {
			objectId : Circuit.id
		});
	}
});

Parse.Cloud.afterSave("DistrictWatch", function(request) {
	var DistrictWatch = request.object;
	if (!DistrictWatch.has('createdDay')) {
		console.log("Create new DistrictWatch");
		Parse.Cloud.run("createDistrictWatchStarted", {
			objectId : DistrictWatch.id
		});
	}
});

Parse.Cloud.afterSave("CircuitUnit", function(request) {
	pushPinUpdate(Pins.CIRCUIT_UNITS, request);

});

Parse.Cloud.afterSave("DistrictWatchClient", function(request) {

	pushPinUpdate(Pins.DISTRICTWATCHS_CLIENT, request);

});

Parse.Cloud.afterSave("EventType", function(request) {

	pushPinUpdate(Pins.EVENT_TYPES, request);

});

Parse.Cloud.afterSave("EventLog", function(request) {

	Parse.Cloud.useMasterKey();

	var EventLog = request.object;

	if (EventLog.get('eventCode') == 125) {
		// alarm report event
		var Alarm = EventLog.get('alarm');
		Alarm.fetch().then(function(Alarm) {

			var Central = Alarm.get('central');

			if (!Central) {
				console.error('missing central')
			} else {

				var event = EventLog.get('event');
				var amount = (EventLog.get('amount') != 0) ? EventLog.get('amount') : '';
				var location = EventLog.get('clientLocation')
				var remarks = EventLog.get('remarks')

				var message = '';
				message += (event) ? "Hændelse: " + event + "\n" : '';
				message += (amount) ? "Antal: " + amount + "\n" : '';
				message += (location) ? "Placering: " + amount + "\n" : '';
				message += (remarks) ? "\nBemærkninger:\n" + remarks : '';


				sendResponseToCentralPointer(Central, Alarm,
						central_responses.EVENT, message).then(function() {
					console.log("Alarm event sent to central: " + event);
				});
			}

		});
	}

});



//Parse.Cloud.afterSave("Client", function(request) {
//	Parse.Cloud.useMasterKey();
//
//	var Client = request.object;
//
	// if (Client.get("isAlarmClient"))
	// return;
//
//	console.log('new position: ' + newPosition);
//	if (newPosition) {
//		// propagate new position to CircuitUnits
//		var CircuitUnit = Parse.Object.extend("CircuitUnit");
//		var query = new Parse.Query(CircuitUnit);
//		query.equalTo('client', Client);
//
//		query.each(function(object) {
//			console.log('updating circuitunit');
//			return object.save();
//		}).then(function() {
//			console.log('circuitunits updated');
//			// pushPinUpdate(Pins.CIRCUIT_UNITS, request);
//		}, function(err) {
//			console.error(err.message);
//		});
//	}
//
//});

/*
 * Get positions for all addressNumbers and place in DistrictWatchGeoPoint
 */
Parse.Cloud.afterSave("DistrictWatchUnit", function(request) {
	Parse.Cloud.useMasterKey();

	var districtWatchUnit = request.object;
	var user = districtWatchUnit.get('owner');

	// pushPinUpdate(Pins.DISTRICTWATCH_UNIT, request);


	var districtWatch = districtWatchUnit.get("districtWatch");

	var addressName = districtWatchUnit.get("address");
	var addressNumbers = districtWatchUnit.get("addressNumbers");

	// look up addresses
	var Client = districtWatchUnit.get('client');

	Client.fetch().then(
			function(client) {

//				var zipcode = districtWatch.get("zipcode");
//				var cityName = districtWatch.get("city");

				var promises = [];
				addressNumbers.forEach(function(addressNumber) {
					var address = addressName + " " + addressNumber;
					// var searchAddress = address + ", "
					// + zipcode + " " + cityName;

					// console.log("Pushing " + searchAddress);
					var promise = createDistrictWatchClient(addressName,
							addressNumber, client, districtWatch,
							districtWatchUnit, user);
					promises.push(promise);
				});
				// Return a new promise that is resolved when all of the deletes
				// are finished.
				return Parse.Promise.when(promises);

			}).then(function() {
		// look up of every address complete
		// pushPinUpdate(Pins.DISTRICTWATCHS_CLIENTS, request);
	}, function(error) {
		console.error(error);
	});

});

var createDistrictWatchClient = function(addressName, addressNumber, client, districtWatch, districtWatchUnit, user) {

	var ACL = new Parse.ACL(user);

	var DistrictWatchClient = Parse.Object.extend("DistrictWatchClient");
	var districtWatchClient = new DistrictWatchClient();
	districtWatchClient.set('arrived', false);
	districtWatchClient.set('timesArrived', 0);
	districtWatchClient.set('client', client);
	districtWatchClient.set('districtWatch', districtWatch);
	districtWatchClient.set('districtWatchUnit', districtWatchUnit);
	districtWatchClient.set('districtWatchType', districtWatchUnit.get('type'));
	districtWatchClient.set('addressName', addressName);
	districtWatchClient.set('addressNumber', addressNumber);
	districtWatchClient.set('zipcode', client.get("zipcode"));
	districtWatchClient.set('cityName', client.get("cityName"));
	districtWatchClient.set("ACL", ACL);
	districtWatchClient.set('owner', user);

	return districtWatchClient.save();

};

// Parse.Cloud.afterSave("DistrictWatchGeoPoint", function(request) {
// var object = request.object;
//
// var searchAddress = object.get('fullAddress');
//
// lookupAddress(searchAddress).then(
// function(point) {
// object.set('position', point);
// object.save();
// },
// function(error) {
// console.error("Failed to create DistrictWatchGeoPoint for : "
// + searchAddress);
// });
//
// });

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
