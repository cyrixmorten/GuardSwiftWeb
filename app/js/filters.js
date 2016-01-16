'use strict';

/* Filters */

var myApp = angular.module('GuardSwiftApp.filters', []);

myApp.filter('truncate', function () {
    return function (text, length, end) {
        if (isNaN(length))
            length = 10;

        if (end === undefined)
            end = "...";

        if (text.length <= length || text.length - end.length <= length) {
            return text;
        }
        else {
            return String(text).substring(0, length-end.length) + end;
        }

    };
});
    
myApp.filter("toArray", function(){
    return function(obj) {
        var result = [];
        angular.forEach(obj, function(val, key) {
            result.push(val);
        });
        return result;
    };
});

/**
 * Sets a default value for a given input.
 * 
 * @param mixed
 *            input
 * @param string
 *            defaultValue
 * @return string
 */
myApp.filter( 'default', [ '$filter', function( $filter ) {
	return function( input, defaultValue ) {
		if ( !input ) return defaultValue;
		
		return input;
	};
}]);

myApp.filter( 'summaryEvent', [  function() {
	return function( input, taskTypeName ) {
		
		var result = [];
		
		angular.forEach(input, function() {
			console.log('summaryEvent ' + input);
			console.log('summaryEvent ' + input.taskTypeName);
			console.log('summaryEvent ' + taskTypeName);
			if (input.taskTypeName !== taskTypeName ) return ;			
		})

		
		return input;
	};
}]);