
'use strict';

/* Directives */

var myApp = angular.module('GuardSwiftApp.directives');

myApp.directive('gsTableEventlogs', [function() {
	return {
		restrict : 'E',
		templateUrl : 'views/logs/table_eventlogs.html',
		transclude : true
	}
}]);
		
myApp.directive('gsEventLogDetails', ['ParseEventLog', '$modal', 
		function(ParseEventLog, $modal) {
			return {
				restrict : 'A',
				scope : {
					objectId : '@',
					detailsPromise : '='	
				},
			    link: function(scope, element, attrs) {
			    	element.bind('click', function() {

			    		console.log(scope);
			    		
						$modal.open({
							templateUrl : 'views/dialog/eventlog.html',
							controller : 'EventlogDetailsDialogCtrl',
							size : 'lg',
							resolve : {
								eventLog : function() {
									// to show busyLoader
									scope.detailsPromise = ParseEventLog.get(scope.objectId, [
										'client', 'taskGroupStarted', 'task']);

									return scope.detailsPromise;
								}
							}
						});

					});
			    }
			}
		}]);