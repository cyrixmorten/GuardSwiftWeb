'use strict';

var controllerModule = angular.module('GuardSwiftApp.controllers');

controllerModule.controller('StandardParseSearchCtrl', ['$scope',
		'TableParams', 'ParseObject', '$filter',
		function($scope, TableParams, ParseObject, $filter) {

			$scope.searchOptions = {
				search : {
					parseObject : ParseObject
				}
			};

			var table = TableParams.LogsTable();

			$scope.tableParams = table.getParams();
			$scope.searchResult = function(result) {
//				console.log($filter('json')(result));
				console.log(result[0]);
				table.load($scope, result);
			};

		}]);

controllerModule.controller('ParseSearchWithQueryCtrl', ['$scope',
		'TableParams', 'ParseObject', 'parseQuery',
		function($scope, TableParams, ParseObject, parseQuery) {

			console.log('ParseSearchWithQueryCtrl');

			$scope.searchOptions = {
				search : {
					parseObject : ParseObject,
					parseQuery : parseQuery
				}
			};

			var table = TableParams.LogsTable();

			$scope.tableParams = table.getParams();
			
			$scope.scopedObjects = [];
			$scope.searchResult = function(result) {
				$scope.scopedObjects = result;
				table.load($scope, result);
			};
			


		}]);

controllerModule.controller('ParseLogResultCtrl', ['$scope', 'TableParams',
		'scopedObjects', function($scope, TableParams, scopedObjects) {

			var table = TableParams.LogsTable();

			$scope.tableParams = table.getParams();

			table.load($scope, scopedObjects);

		}]);

controllerModule
		.controller(
				'ExperimentsCtrl',
				[
						'$scope',
						'$timeout',
						'uiGmapGoogleMapApi',
						'gpsData',
						'eventData',
						'clientData',
						'groundtruthData',
						function($scope, $timeout, uiGmapGoogleMapApi, gpsData, eventData, clientData, groundtruthData) {
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
							
							$scope.map.pathPolys = [];
							$scope.geofences = [];
							$scope.clientMarkers = [];
							$scope.eventMarkers = [];
							$scope.collisionMarkers = [];

							uiGmapGoogleMapApi
									.then(function(maps) {

										$timeout(
												function() {

													/** ADD CLIENT MARKERS * */
													var clients = clientData.data;


													for (var i = 0, len = clients.length; i < len; i++) {
														var client = clients[i];
														$scope.clientMarkers
																.push({
																	id : i,
																	coords : {
																		latitude : client.latitude,
																		longitude : client.longitude
																	},
																	// icon :
																	// 'assets/mapicons/all/office-building.png',
																	icon : 'assets/mapicons/transparent.png',
																	options : {
																		labelAnchor : "0 0",
																		labelClass : "marker-labels",
																		labelContent : client.name
																	}
																});
														$scope.geofences
																.push({
																	id : i,
																	center : {
																		latitude : client.latitude,
																		longitude : client.longitude
																	},
																	radius : client.radius,
																	stroke : {
																		color : '#08B21F',
																		weight : 2,
																		opacity : 0
																	},
																	fill : {
																		color : '#08B21F',
																		opacity : 0.3
																	},

																})
													}

													/** CREATE PATH FROM GPS DATA * */
													var gpsJsonArray = gpsData.data;

													var path = [];
													var skipped_indexes = [];

													var createPath = function(id, path, color, visible) {
														var pathCopy = angular
																.copy(path);
														$scope.map.pathPolys
																.push({
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
													
													var clientLECs = [];
													
													var collision = function(posIndex, Ax, Ay, Bx, By) {
														console.log('collision');



														var innerRadius = 40;
														
														var A = new google.maps.LatLng(
																Ax,
																Ay);
														var B = new google.maps.LatLng(
																Bx,
																By);
														
														// first 3 clients for now
														for (var i = 0, len = clients.length; i < len; i++) {
														
															var client = clients[i];
//															
												            var Cx = client.latitude;
												            var Cy = client.longitude;
												            
												            var C = new google.maps.LatLng(Cx, Cy);
	
												            // compute the euclidean distance between A and B

												            var a = google.maps.geometry.spherical.computeDistanceBetween(B,C);
												            var b = google.maps.geometry.spherical.computeDistanceBetween(A,B);
												            var c = google.maps.geometry.spherical.computeDistanceBetween(A,C);
												            
												            
												            
												            // Heron
												            var s = (a+b+c)/2;
												            var area = Math.sqrt(s*(s-a)*(s-b)*(s-c));
												            
												            // A = 1/2*h*b
												            var h = (2*area)/b
												            
												            // h^2 + t^2 = c^2
												            // t = sqrt(c-h)
												            
												            var t = Math.sqrt(Math.pow(c,2)-Math.pow(h,2));
												            
												            console.log(a);
												            console.log(b);
												            console.log(c);
												            console.log("h: " + h);
												            console.log("t: " + t);
												            
//												            var LAB = Math.sqrt(Math.pow(Bx-Ax, 2)+Math.pow(By-Ay, 2));
//												            console.log("LAB: " + LAB);
	
												            // compute the direction vector D from A to B
												            var Dx = (Bx-Ax)/b;
												            var Dy = (By-Ay)/b;
//												            console.log("Dx: " + Dx + ", Dy: " + Dy);
	
												            // Now the line equation is x = Dx*t + Ax, y = Dy*t + Ay with 0 <= t <= 1.
	
												            // compute the value t of the closest point to the circle center (Cx, Cy)
//												            var tx = Dx*(Cx-Ax); 
//												            var ty = Dy*(Cy-Ay);
//												            console.log("tx: " + tx + ", ty: " + ty);
//												            var LZERO = new google.maps.LatLng(0,0);
//												            var T = new google.maps.LatLng(tx,ty);
//												            var t = google.maps.geometry.spherical.computeDistanceBetween(LZERO, T);
//												            var t = tx + ty;
//												            var t = t*LAB;
//												            t = t*1000;
//												            console.log("t:	 " + t);
//												            
//												            var T = new google.maps.LatLng(t*Dx,t*Dy);
//												            var tdist = google.maps.geometry.spherical.computeDistanceBetween(LZERO, T);
//												            console.log("tdist: " + tdist);
												            
												            
//												            var tarray = [LAB/4, LAB/4*2, LAB/4*3];
												            var Earray = [];
//////												            
//												            for (var tindex = 0; tindex<tarray.length; tindex++) {
//													            // compute the coordinates of the point E on line and closest to C
													            var Ex = t*Dx+Ax;
													            var Ey = t*Dy+Ay;
													            var E = new google.maps.LatLng(Ex,Ey);
													            var LEC = google.maps.geometry.spherical.computeDistanceBetween(E, C); // convert to meters
													            console.log("b: " + b);
													            console.log("LEC: " + LEC);
													            Earray.push({E:[Ex,Ey],LEC:LEC});
//												            }
												            
//												            Vector2 AP = P - A;       //Vector from A to P   
//												            Vector2 AB = B - A;       //Vector from A to B  
//
//												            float magnitudeAB = AB.LengthSquared();     //Magnitude of AB vector (it's length squared)     
//												            float ABAPproduct = Vector2.Dot(AP, AB);    //The DOT product of a_to_p and a_to_b     
//												            float distance = ABAPproduct / magnitudeAB; //The normalized "distance" from a to your closest point  
//
//												            if (distance < 0)     //Check if P projection is over vectorAB     
//												            {
//												                return A;
//
//												            }
//												            else if (distance > 1)             {
//												                return B;
//												            }
//												            else
//												            {
//												                return A + AB * distance;
//												            }
												            
												            // http://stackoverflow.com/questions/3120357/get-closest-point-to-a-line
//												            var AC = [Cx-Ax, Cy-Ay];
//												            var AB = [Bx-Ax, By-Ay];
//												            
//												            var magnitudeAB = Math.sqrt(Math.pow(AB[0], 2)+Math.pow(AB[1], 2));
//												            var ABACproduct = AB[0]*AC[0]+AB[1]*AC[1];
//												            var distance = ABACproduct / magnitudeAB;
												            
//												            var E = [Ax, Ay]
												            
												            
//												            
//												            console.log("magnitudeAB: " + magnitudeAB);
//												            console.log("ABACproduct: " + ABACproduct);
//												            console.log("distance: " + distance);	
//												            
//												            var E = [];
//												            if (distance < 0) {
//												            	E = [Ax,Ay];
//												            }
//												            else if (distance > 1) {
//												            	E = [Bx,By];
//												            } else {
//												            	E = [Bx + AB[0] * distance, By + AB[1] * distance];
//												            }
////												            
//												            console.log("Ex: " + E[0]);
//												            console.log("Ey: " + E[1]);
////												            
//												            var E = new google.maps.LatLng(E[0],E[1]);
//												            var LEC = google.maps.geometry.spherical.computeDistanceBetween(E, C); // convert to meters
//												            
//												            console.log("LEC: " + LEC);
//												            
//												            Earray.push({E:[E[0],E[1]],LEC:LEC});
												            // compute the euclidean distance from E to C
												            
//												            var LEC = Math.sqrt(Math.pow(Ex-Cx,2)+Math.pow(Ey-Cy, 2));
												            
												            

												            clientLECs.push({
												            	i : posIndex,
												            	client : client,
//												            	Ax : Ax,
//												            	Ay : Ay,
//												            	Bx : Bx,
//												            	By : By,
												            	Earray : Earray
												            });
														}
														
													}
													
													var addLECs = function() {
														console.log("clientLECs: " + clientLECs.length);
														
														angular.forEach(clientLECs, function(clientLEC) {
															var client = clientLEC.client;
															var Earray = clientLEC.Earray;
															
																
																angular.forEach(Earray, function(EObject) {
																	console.log("Adding E; " + EObject.E)
													            $scope.collisionMarkers
																.push({
																	id : Math.random(1000000),
																	coords : {
																		latitude : EObject.E[0],
																		longitude : EObject.E[1]
																	},
																	 icon :
																	 'assets/mapicons/all/office-building.png',
																	//icon : 'assets/mapicons/transparent.png',
																	options : {
																		labelAnchor : "0 0",
																		labelClass : "marker-labels",
																		labelContent : EObject.LEC
																	}
																});
															});
												            
//												            console.log(client.name + " " + LEC + " [" + clientLEC.Ex + "," + clientLEC.Ey + "]");
														})
													}

													var skipped = 0;
													for (var i = 0, len = gpsJsonArray.length; i < len; i++) {
														var gps = gpsJsonArray[i];

														var isFirst = (i === 0);
														var isLast = (i === len - 1);
														var next_index = i + 1;
														if (next_index < len) {
															var nextgps = gpsJsonArray[next_index];

															var latlng2 = new google.maps.LatLng(
																	nextgps.latitude,
																	nextgps.longitude);
															var latlng1 = new google.maps.LatLng(
																	gps.latitude,
																	gps.longitude);
															
															collision(i, gps.latitude, gps.longitude, nextgps.latitude, nextgps.longitude);
//												            clientLECs.push({
//												            	i : i,
//												            	Ax : gps.latitude,
//												            	Ay : gps.longitude,
//												            });

															var t1 = gps.time;
															var t2 = nextgps.time;

															var t_diff = Math
																	.abs(t2
																			- t1);

															if (t_diff > 30000) {
																console
																		.log('skipping '
																				+ i
																				+ ' due to high tdiff '
																				+ t_diff);
																createPath(
																		i,
																		path,
																		"#eb1e1e",
																		true);
																path = [];
															} else {
																path
																		.push(latlng1);
															}
														} else {
															path
																	.push({
																		latitude : gps.latitude,
																		longitude : gps.longitude
																	});
															createPath(i, path,
																	"#eb1e1e",
																	true);
														}

														if (isFirst) {
															var startMarker = {
																id : i,
																coords : {
																	latitude : gps.latitude,
																	longitude : gps.longitude
																},
																options : {
																	zIndex : 999
																}
															}
															startMarker.options = {
																icon : 'assets/mapicons/letter/red/letter_a.png'
															}
															$scope.startMarker = startMarker;
														}
														if (isLast) {
															var endMarker = {
																id : i,
																coords : {
																	latitude : gps.latitude,
																	longitude : gps.longitude
																},
																options : {
																	zIndex : 999
																}
															}
															endMarker.options = {
																icon : 'assets/mapicons/letter/red/letter_b.png'
															}
															$scope.endMarker = endMarker;
														}
													}
													
													/** LECs **/
													addLECs();

													/** ADD EVENT MARKERS * */
													var events = eventData.data;

													var taskEventObject = function(event) {
														
														var taskEvent = event.taskEvent;
														
														if (!taskEvent)
															return;

														console.log(taskEvent);
														
														if (taskEvent == "ARRIVE") {
															var icon = 'assets/mapicons/all/police.png';
															if (event.eventCode === 111)  { // districtWatch
																var clientName = event.clientName;
																var number = clientName.substring(2);
																icon = 'assets/mapicons/number/blue/number_'+ number +'.png';
															}
															return {
																name : 'Arrive',
																icon : icon
															};
														}

														if (taskEvent == "ABORT") {
															return {
																name : 'Abort',
																icon : 'assets/mapicons/all/exit.png'
															};
														}
														/*
														if (taskEvent == "GEOFENCE_ENTER_GPS") {
															return {
																name : 'Geofence enter',
																icon : ''
															}
														}
														
														if (taskEvent == "GEOFENCE_EXIT_GPS") {
															return {
																name : 'Geofence exit',
																icon : ''
															}
														}*/
													}

													
													for (var i = 0, len = events.length; i < len; i++) {
														var event = events[i];
														console.log(event);
														var position = event.position;

														var taskObject = taskEventObject(event);
														if (position
																&& taskObject) {
															$scope.eventMarkers
																	.push({
																		id : i,
																		name : taskObject.name,
																		icon : taskObject.icon,
																		coords : {
																			latitude : position.latitude,
																			longitude : position.longitude
																		},
																		options : {
																			zIndex : 1
																		}
																	});
														}
													}

													/** CREATE PLOT DATA * */
													
													var activities = [];
													var arriveaborts = [];
													var startTime = 0;
													
													if (groundtruthData) {
														startTime = groundtruthData.data.BEGIN_AUTO/1000;
													}
													
													events.reverse();
													for (var i = 0, len = events.length; i < len; i++) {
														var event = events[i];
														
														var relTimeSeconds = 0;
														
														var eventTime = event.clientTimestampUnix;
														if (i == 0 && startTime == 0) {
															startTime = eventTime;
														} else {
															relTimeSeconds = (eventTime - startTime); 
														}
															
														
														var eventName = event.event;
														var taskEvent = event.taskEvent;
														
														if (eventName == "Activity") {
															activities.push({
																time : relTimeSeconds,
																name : event.remarks,
																confidence : event.activityConfidence
															});
														}
														
														if (taskEvent) {
															if (taskEvent == "ARRIVE" || taskEvent == "ABORT") {
																arriveaborts.push({
																	time : relTimeSeconds,
																	client : event.clientName,
																	event : taskEvent 
																});
															}
															
//															if (taskEvent.indexOf("GEOFENCE") !== -1) {
//																arriveaborts.push({
//																	time : relTimeSeconds,
//																	client : event.type,
//																	event : taskEvent 
//																});
//															}
														}
														

													}
													
													console.log("\n\n--- ACTIVITIES ---\n\n");
													
													angular.forEach(activities, function(activity) {
														console.log(activity.name + " - " + activity.confidence + " - " + activity.time);
													});
													
													console.log("\n\n--- ARRIVEABORT ---\n\n");
													
													angular.forEach(arriveaborts, function(arriveabort) {
														console.log(arriveabort.event + " " + arriveabort.client + " " + arriveabort.time);
													});
													
													console.log("\n\n--- GROUNDTRUTH ---\n\n");
													
													/** CREATE GROUNDTRUTH **/
													if (groundtruthData) {
														groundtruthData = groundtruthData.data;
														
														var begin_gt = groundtruthData.BEGIN_GT;
														var begin_auto = groundtruthData.BEGIN_AUTO;
														
														var offset = begin_gt - begin_auto;
														console.log("Offset : " + offset);
														
														var events = groundtruthData.EVENTS;
														
														for (var i = 0; i<events.length; i++) {
															var event = events[i];															
															for(var eventName in event) {
																var eventTime_gt = event[eventName];
																var eventRelativeTimeMiliseconds = eventTime_gt - begin_gt;
																var eventRelativeTimeSeconds = eventRelativeTimeMiliseconds/1000;
																console.log(eventName + ": " + eventRelativeTimeSeconds);
															}
														}
														
													}
													
												}, 2000);
									});
						}]);

