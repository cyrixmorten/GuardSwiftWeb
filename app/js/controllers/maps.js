angular.module('GuardSwiftApp.controllers').controller(
    'GPSLogCtrl',
    [
        '$scope',
        '$timeout',
        'ParseTracker',
        'ParseClient',
        'ParseEventLog',
        /* 'MapMarkers', */
        'uiGmapGoogleMapApi',
        function($scope, $timeout, ParseTracker, ParseClient, ParseEventLog, /* MapMarkers, */uiGmapGoogleMapApi) {

            // if ($scope.init && !$scope.isPublic) {
            // console.log('init');
            // $scope.init($scope, GPSTracker, {
            // table : TableParams.LogsTable()
            // });
            // }

            // $scope.cluster = false;

            console.log("GPSLogCtrl");

            $scope.searchOptions = {
                search : {
                    parseObject : ParseGPSTracker,
                }
            };

            $scope.searchResult = function(result) {
                var combinedGpsData = [];
                angular.forEach(result, function(gpsTracker) {
                    angular.forEach(gpsTracker.gpsData,
                        function(gpsData) {
                            combinedGpsData.push(gpsData);
                        });
                });
                $scope.loadGPSData(combinedGpsData);
            };

            addClientMarkers($scope, ParseClient);

            $scope.enterMarker = function(marker) {

                $scope.marker = {}; // clear previous marker

                marker.$active = true;
                $scope.marker = angular.copy(marker);
                $scope.marker.show = true;
                $scope.marker.options = {
                    zIndex : 99999999
                };

                // --
                // $scope.marker = {
                // id : 'selectedMarker',
                // coords : marker.coords,
                // icon : 'assets/icon/marker_green.png',
                // velocity : marker.velocity,
                // timeStamp : marker.timeStamp,
                // show: true,
                // options : {
                // //animation: google.maps.Animation.BOUNCE,
                // zIndex : 99999999
                // }
                // };
            };

            $scope.exitMarker = function(marker) {

                marker.$active = false;

                // marker.$active = false;
                // $scope.marker = '';
            };

            $scope.zoomToMarker = function(marker) {

                console.log('zoomToMarker');

                $scope.enterMarker(marker);

                $scope.map.fit = false;

                // $scope.map.center =
                // angular.copy(marker.coords);
                // $scope.map.zoom = 19;
                // marker.$selected = true;
            };

            // -- map

            $scope.map = {
                center : {
                    latitude : 55.5475295,
                    longitude : 9.4843681
                },
                options : {},
                zoom : 5,
                pan : true,
                fit : false,
                pathPolys : [],
                pathMarkers : [],
                markerEvents : {
                    click : function(gMarker, eventName, markerModel) {
                        console.log(eventName);
                        console.log(markerModel);
                    }
                },
                polyEvents : {
                    click : function(gPoly, eventName, polyModel) {
                        console.log(eventName);
                        console.log(polyModel);
                    }
                },
            };

            // -- markers

            $scope.markersOptions = {
                visible : false
            };

            uiGmapGoogleMapApi
            .then(function(maps) {
                console.log('map loaded');

                $timeout(
                    function() {
                        console.log('showmaps');

                        $scope.showMap = true;

                        $scope.map.options = {
                            mapTypeId : google.maps.MapTypeId.HYBRID
                        };
                    }, 100);

            });


            $scope.markersEvents = {
                mouseover : function(marker, eventName, markerModel, args) {
                    markerModel.show = !markerModel.show;
                    // $scope.enterMarker(markerModel);
                }
            };


            // allow parent to load gps data
            $scope.$on('loadGPSData', function(e, data) {
                console.log('-> loadGPSData');
                $scope.loadGPSData(data.object, data.gpsData,
                    data.fit);
            });

            $scope.polylineCtrl = {};

            var createPath = function(id, path, color, visible) {
                var pathCopy = angular.copy(path);
                $scope.map.pathPolys.push({
                    "id" : id,
                    "path" : pathCopy,
                    "stroke" : {
                        "color" : color,
                        "weight" : 3
                    },
                    "editable" : false,
                    "draggable" : false,
                    "geodesic" : true,
                    "visible" : visible
                });
            };

            $scope.loadGPSData = function(gpsJsonArray) {

                $scope.map.pathPolys = [];
                $scope.map.pathMarkers = [];

                console.log('loadGPSData');
                console.log(gpsJsonArray);

                $scope.map.fit = true;


                // load data
                $scope.eventMarkers = [];
                $scope.markers = [];

                var path = [];
                var skipped_indexes = [];

                var skipped = 0;
                for (var i = 0, len = gpsJsonArray.length; i < len; i++) {
                    var gps = gpsJsonArray[i];

                    var next_index = i + 1;
                    if (next_index < len) {

                        var nextgps = gpsJsonArray[next_index];

                        // var latlng2 = new google.maps.LatLng(
                        //     nextgps.latitude,
                        //     nextgps.longitude);
                        // var latlng1 = new google.maps.LatLng(
                        //     gps.latitude, gps.longitude);
                        // var distance =
                        // google.maps.geometry.spherical
                        // .computeDistanceBetween(
                        // latlng1, latlng2);

                        var t1 = gps.time;
                        var t2 = nextgps.time;

                        var t_diff = Math.abs(t2 - t1);

                        if (t_diff > 30000) {
                            console.log('skipping ' + i
                                + ' due to high tdiff '
                                + t_diff);
                            createPath(i, path, "#eb1e1e", true);
                            path = [];
                        } else {
                            path.push(latlng1);
                        }
                    } else {
                        path.push({
                            latitude : gps.latitude,
                            longitude : gps.longitude
                        });
                        createPath(i, path, "#eb1e1e", true);
                    }


                    var marker = {
                        id : i,
                        show : false,
                        coords : {
                            latitude : gps.latitude,
                            longitude : gps.longitude
                        },
                        velocity : gps.speed,
                        velocityKm : (gps.speed * 3.6)
                        .toFixed(1),
                        timeStamp : new Date(gps.time),
                        event : gps.event,
                        options : {
                            visible : false
                        }
                        // icon : icon
                    };

                    $scope.map.pathMarkers.push(marker);


                }


            };

        }]);

var addClientMarkers = function($scope, ParseClient) {
    $scope.clientMarkers = [{
        id : 1,
        coords : {}
    }];
    ParseClient.fetchAll().then(function(scopedObjects) {
        $scope.clientMarkers = [];
        for (var i = 0, len = scopedObjects.length; i < len; i++) {
            var scopedClient = scopedObjects[i];
            var position = scopedClient.position;
            $scope.clientMarkers.push({
                id : i,
                coords : {
                    latitude : position.latitude,
                    longitude : position.longitude
                },
                icon : 'assets/mapicons/all/office-building.png',
                options : {
                    labelAnchor : "0 0",
                    labelClass : "marker-labels",
                    labelContent : scopedClient.name
                }
            });
        }

    });
};