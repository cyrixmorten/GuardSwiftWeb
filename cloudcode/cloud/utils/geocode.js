var Global = require('cloud/global.js');


exports.lookupAddress = function (searchAddress) {
    var promise = new Parse.Promise();
    Parse.Cloud.httpRequest({
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        params: {
            address: searchAddress,
            key: Global.GOOGLE_GEOCODE_API_KEY
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