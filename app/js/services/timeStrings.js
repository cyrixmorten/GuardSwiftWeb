'use strict';

var app = angular.module('GuardSwiftApp.services');

app.factory('TimeStrings', [
                     		'$q',
                     		'$translate',
                     		function($q, $translate) {
                     			
                     			var hours = new Array(24);
                     			for (var i = 0; i < hours.length; i++) {
                     				if (i < 10) {
                     					hours[i] = {
                     						value : i,
                     						text : "0" + i + ":00"
                     					};
                     				} else {
                     					hours[i] = {
                     						value : i,
                     						text : i + ":00"
                     					};
                     				}
                     			}
                     			var hoursPromise = $q.when(hours);
                     			
                     			var deferDays = $q.defer();
                     			$translate(
                     					['WEEKDAY_SUNDAY_AND_HOLIDAYS', 'WEEKDAY_MONDAY', 'WEEKDAY_TUESDAY',
                     							'WEEKDAY_WEDNESDAY', 'WEEKDAY_THURSDAY', 'WEEKDAY_FRIDAY',
                     							'WEEKDAY_SATURDAY']).then(function(translations) {

                     					// show all
                     					var days = [{
                     						id : 0,
                     						name : translations.WEEKDAY_SUNDAY_AND_HOLIDAYS
                     					}, {
                     						id : 1,
                     						name : translations.WEEKDAY_MONDAY
                     					}, {
                     						id : 2,
                     						name : translations.WEEKDAY_TUESDAY
                     					}, {
                     						id : 3,
                     						name : translations.WEEKDAY_WEDNESDAY
                     					}, {
                     						id : 4,
                     						name : translations.WEEKDAY_THURSDAY
                     					}, {
                     						id : 5,
                     						name : translations.WEEKDAY_FRIDAY
                     					}, {
                     						id : 6,
                     						name : translations.WEEKDAY_SATURDAY
                     					}];
                     					
                     					deferDays.resolve(days);

                     			}, function(error) {
                     				deferDays.reject(error);
                     			});
                     			var daysPromise = deferDays.promise; 
                     			
                     			var daysBack = [
                    				'I dag',
                    				'Seneste 7 dage',
                    				'Seneste 14 dage',
                    				'Seneste måned',
                    				'Seneste 3 måneder',
                    				'Seneste 6 måneder',
                    				'Seneste 12 måneder',
                    			];
                     			var daysBackPromise = $q.when(daysBack);

//                     			return {
//                     				getHours : function() {
//                     					return hours;
//                     				},
//                     				getDays : function() {
//                     					return deferDays.promise;
//                     				}
//                     			};
                     			
                     	        return $q.all([hoursPromise, daysPromise, daysBackPromise]).then(function(results){
                     	            return {
                     	                hours: results[0],
                     	                days: results[1],
                     	                daysBack : results[2]
                     	            };
                     	        });
                     		}]);
