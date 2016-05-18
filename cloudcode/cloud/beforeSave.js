var _ = require('underscore');
var Static = require("cloud/static.js");
var Mailing = require("cloud/mailing.js");

//** SETUP NEW
Parse.Cloud.beforeSave("_User", function (request, response) {
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



Parse.Cloud.beforeSave("EventLog", function (request, response) {

    var EventLog = request.object;

    // avoid 'undefined' for automatic
    var automatic = EventLog.get('automatic');
    if (!automatic) {
        EventLog.set('automatic', false);
    }

    response.success();


});


/*
 * Sanity check and obtain a GPS position for Client
 */
Parse.Cloud.beforeSave("Client", function (request, response) {
    Parse.Cloud.useMasterKey();

    var Client = request.object;

    var dirtyKeys = Client.dirtyKeys();
    var lookupAddress = false;
    var addressKeys = ["cityName", "zipcode", "addressName", "addressNumber"]
    for (var dirtyKey in dirtyKeys) {
        var dirtyValue = dirtyKeys[dirtyKey];
        if (_.contains(addressKeys, dirtyValue)) {
            lookupAddress = true;
            console.log(dirtyValue + ": " + lookupAddress);
        }
    }

    if (lookupAddress) {
        console.log("do addAddressToClient");
        addAddressToClient(Client, response);
    } else {
        console.log("no address lookup");
        response.success();
    }


});


/*
 * Auto set timesUsed to 0 if not defined
 */
Parse.Cloud.beforeSave("EventType", function (request, response) {
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

Parse.Cloud.beforeSave("CircuitUnit", function (request, response) {
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
        clientPointer.fetch().then(function (client) {
            CircuitUnit.set('clientPosition', client.get('position'));
            response.success();
        }, function (error) {
            console.error("error at clientPointer " + error.message);
            response.success();
        });
    } else {
        response.success();
    }

});

Parse.Cloud.beforeSave(
    "DistrictWatchClient",
    function (request, response) {
        Parse.Cloud.useMasterKey();

        var DistrictWatchClient = request.object;

        var DistrictWatchUnit = DistrictWatchClient.get('districtWatchUnit');

        DistrictWatchUnit.fetch().then(
            function (districtWatchUnit) {

                DistrictWatchClient.set('supervisions', districtWatchUnit.get('supervisions'));
                DistrictWatchClient.set('days', districtWatchUnit.get('days'));

                if (!DistrictWatchClient.has('completed'))
                    DistrictWatchClient.set('completed', false);


                var addressName = DistrictWatchClient.get("addressName");
                var addressNumber = DistrictWatchClient.get("addressNumber");
                var zipcode = DistrictWatchClient.get("zipcode");
                var cityName = DistrictWatchClient.get("cityName");

                DistrictWatchClient.set(
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
                    response.error("Address must not be empty");
                } else if (zipcode == 0) {
                    if (cityName.length == 0) {
                        response.error("Zipcode and city name must not be empty");
                    }
                } else {
                    lookupAddress(
                        searchAddress).then(
                        function (point) {

                            DistrictWatchClient.set(
                                "position",
                                point);

                            response.success();
                        },
                        function (error) {
                            response.error("Address not found: "
                                + searchAddress);
                        });
                }
            }, function (error) {
                console.error('missing districtWatchUnit');
                DistrictWatchClient.destroy();
                response.success();
            });

    });




/*
 * Sanity check and obtain a GPS position for first addressNumber
 */
Parse.Cloud.beforeSave(
    "DistrictWatchUnit",
    function (request, response) {
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

        DistrictWatch.fetch().then(
            function (districtWatch) {

                var zipcode = districtWatch.get("zipcode");
                var cityName = districtWatch.get("city");

                var searchAddress = addressName + " "
                    + addressNumbers[0] + ","
                    + zipcode + " " + cityName;

                if (zipcode == 0) {
                    if (cityName.length == 0) {
                        response.error("Zipcode and city name must not be empty");
                    }
                } else {
                    lookupAddress(searchAddress).then(
                        function (point) {
                            unit.set(
                                "position",
                                point);
                            if (unit.isNew()) {
                                response.success();
                            } else {
                                var DistrictWatchClient = Parse.Object.extend("DistrictWatchClient");
                                var cleanUpQuery = new Parse.Query(
                                    DistrictWatchClient);
                                cleanUpQuery.equalTo(
                                    'districtWatchUnit',
                                    unit);
                                cleanUpQuery.each(
                                    function (object) {
                                        // remove
                                        // all
                                        // earlier
                                        // associated
                                        // DistrictWatchClient's
                                        return object.destroy();
                                    }).then(
                                    function () {
                                        response.success();
                                    },
                                    function (error) {
                                        console.error(error.message);
                                        response.error(error.message);
                                    });
                            }
                        },
                        function (error) {
                            response.error("Address not found: "
                                + searchAddress);
                        });
                }
            }, function (error) {
                console.error(error.message);
                console.error(DistrictWatch);
                unit.set("invalidPointer", true);
                response.success();
            });

    });


var addAddressToClient = function (Client, response) {

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
        lookupAddress(searchAddress).then(function (point) {

            Client.set("position", point);

            console.log('setting new position:');
            console.log(point);

            response.success();
        }, function (error) {
            response.error("Address not found: " + searchAddress);
        });
    }
};

var lookupAddress = function (searchAddress) {
    var promise = new Parse.Promise();
    Parse.Cloud.httpRequest({
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        params: {
            address: searchAddress,
            key: Static.GOOGLE_GEOCODE_API_KEY
        },
        success: function (httpResponse) {
            var data = httpResponse.data;
            if (data.status == "OK") {

                var latlng = data.results[0].geometry.location;

                var lat = latlng.lat;
                var lng = latlng.lng;

                var point = new Parse.GeoPoint({
                    latitude: lat,
                    longitude: lng
                });

                promise.resolve(point);

            } else {
                console.error(httpResponse);
                promise.reject("Failed to locate coordinate for : "
                    + searchAddress);
            }
        },
        error: function (httpResponse) {
            promise.reject(httpResponse);
            console.error(httpResponse);
        }
    });
    return promise;
};
