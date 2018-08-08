'use strict';

var app = angular.module('GuardSwiftApp.services');


app.service('ParseService', function() {

	Parse.initialize("guardswift");

	if (document.location.hostname === "localhost") {
		// Development
        console.warn('RUNNING LOCAL');
		// Parse.serverURL = 'http://localhost:1337/parse';
		Parse.serverURL = 'https://gsdev-server.herokuapp.com/parse';
	} else {
		// Release
		Parse.serverURL = 'https://guardswift-server.herokuapp.com/parse';
	}

	this.Account = new function() {


		var isLoggedIn = function() {
			return !!Parse.User.current();
			
		};
		
		var getUser = function() {
			return Parse.User.current();
		};

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
