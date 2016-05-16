Parse.Cloud.afterSave("EventLog", function (request) {

    var EventLog = request.object;


    var appVersion = EventLog.get('gsVersion');
    if (appVersion < 318) {
        console.log('App version too low for cloud code report handling', 'version:' + appVersion, 'expected: >=318');
        response.success();
        return;
    }

    var reportNotFoundError = new Error('Report not found');

    var getReportId = function () {
        if (EventLog.has('staticTask')) {
            return EventLog.get('client').id + EventLog.get('staticTask').id
        }
        if (EventLog.has('circuitUnit')) {
            return EventLog.get('circuitStarted').id + EventLog.get('circuitUnit').id
        }
        if (EventLog.has('districtWatchClient')) {
            return EventLog.get('districtWatchStarted').id + EventLog.get('districtWatchClient').id
        }

        throw new Error('Unable to get reportId')
    };


    var findReport = function () {
        console.log('findReport');

        console.log('reportId ' + getReportId());

        var query = new Parse.Query(Parse.Object.extend('Report'));
        query.equalTo('reportId', getReportId());

        return query.first().then(function (report) {
            return (report) ? report : Parse.Promise.error(reportNotFoundError);
        });
    };

    var writeEvent = function (report) {
        console.log('writeEvent ' + report.get('clientAddress'));

        if (EventLog.get('eventCode') === 105) {
            report.set('extraTimeSpent', EventLog.get('amount'));
        }

        EventLog.set('reported', true);
        report.addUnique('eventLogs', EventLog);
        report.increment('eventCount');

        return report.save();
    };

    var createReport = function () {
        console.log('createReport');

        var Report = Parse.Object.extend('Report');
        var report = new Report();

        Object.keys(EventLog.attributes).forEach(function (fieldName) {
            report.set(fieldName, EventLog.get(fieldName));
        });

        return report.save();
    };

    if (!EventLog.get('reported')) {
        findReport().fail(function (error) {
            if (error === reportNotFoundError) {
                return createReport().then(writeEvent);
            }
        }).then(writeEvent);
    } else {
        console.log('Already written to report');
    }

});

Parse.Cloud.afterSave("Circuit", function (request) {
    var Circuit = request.object;
    if (!Circuit.has('createdDay')) {
        console.log("Create new circuitStarted");
        Parse.Cloud.run("createCircuitStarted", {
            objectId: Circuit.id
        });
    }
});

Parse.Cloud.afterSave("DistrictWatch", function (request) {
    var DistrictWatch = request.object;
    if (!DistrictWatch.has('createdDay')) {
        console.log("Create new DistrictWatch");
        Parse.Cloud.run("createDistrictWatchStarted", {
            objectId: DistrictWatch.id
        });
    }
});


/*
 * Get positions for all addressNumbers and place in DistrictWatchGeoPoint
 */
Parse.Cloud.afterSave("DistrictWatchUnit", function (request) {
    Parse.Cloud.useMasterKey();

    var districtWatchUnit = request.object;
    var user = districtWatchUnit.get('owner');


    var districtWatch = districtWatchUnit.get("districtWatch");

    var addressName = districtWatchUnit.get("address");
    var addressNumbers = districtWatchUnit.get("addressNumbers");

    // look up addresses
    var Client = districtWatchUnit.get('client');

    Client.fetch().then(
        function (client) {

//				var zipcode = districtWatch.get("zipcode");
//				var cityName = districtWatch.get("city");

            var promises = [];
            addressNumbers.forEach(function (addressNumber) {
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

        }).then(function () {
        // look up of every address complete
        // pushPinUpdate(Pins.DISTRICTWATCHS_CLIENTS, request);
    }, function (error) {
        console.error(error);
    });

});

var createDistrictWatchClient = function (addressName, addressNumber, client, districtWatch, districtWatchUnit, user) {

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



