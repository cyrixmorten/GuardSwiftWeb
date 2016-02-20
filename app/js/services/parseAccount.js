'use strict';

var app = angular.module('GuardSwiftApp.services');


app.service('ParseService', function() {

	if (document.location.hostname == "localhost") {
		// Development
		Parse.initialize("7fynHGuQW5NZLROiIDcCzLddbINcUSwPdoE0L72d",
				"nauoHYYcCFXHNIBvEfjmC0plOQKxJKTCVZbgaytg");
	} else {
		// Release
		Parse.initialize("gejAg1OFJrBwepcORHB3U7V7fawoDjlymRe8grHJ",
				"TZDGcjak3YJfmkLzTCacZvgAjrQOSUOGvO7IEDHU");
	}

	this.Account = new function() {


		var isLoggedIn = function() {
			if (Parse.User.current()) {
				return true;
			}
			return false;
		};
		
		var getUser = function() {
			return Parse.User.current();
		}

		var getUsername = function() {
			return Parse.User.current().get('username');
		};

		var settings = function() {

		};


		return {

			isLoggedIn : isLoggedIn,
			getUsername : getUsername,
			currentUser : Parse.User.current(),
			
			getSettings : function() {
				return {
					broadcast_alarms : Parse.User.current().get('broadcast_alarms')
				}
			},
			login : function(username, password, callback) {
				Parse.User.logIn(username, password, callback);
			},
			logout : function() {
				Parse.User.logOut()
			}
		};
	};

});
