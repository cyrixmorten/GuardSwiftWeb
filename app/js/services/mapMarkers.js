'use strict';

var app = angular.module('GuardSwiftApp.services');

app.factory('MapMarkers', [function() {

	var colors = {
		yellow : "yellow",
		blue : "blue",
		lightblue : "ltblue",
		green : "green",
		orange : "orange",
		pink : "pink",
		purple : "purple",
		red : "red"
	}
	
	var activity_colors = [
			colors.red, // in_vehicle
			colors.orange, // on_bicycle
			colors.blue, // on_foot
			colors.lightblue,// still
			'', // unknown
			colors.yellow, // tilting
			'', // ?
			colors.purple, // walking
			colors.orange // running
	]

	var marker_url = function(color, withDot, withShadow) {
		var dot = (withDot) ? '-dot' : '';
		var shadow = (withShadow) ? '.shadow' : ''
		return "http://maps.google.com/mapfiles/ms/micons/" + color + dot
				+ shadow + ".png"
	}
	
	var activity_marker = function(activityType) {
		var color = activity_colors[activityType];
		if (color) {
			return marker_url(color, true, false);
		} else {
			console.log("no color for activity: " + activityType);
			return '';
		}
	}

	return {
		getMarkerFromActivity : function(activityType) {
			return activity_marker(activityType)
		}
	}
}]);