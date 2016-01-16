'use strict';

var controllerModule = angular.module('GuardSwiftApp.controllers');

controllerModule.controller('AccountCtrl', [function() {

}]);


controllerModule.controller('UserCtrl', ['$scope', 'parseUser', function($scope, parseUser) {
	$scope.user = angular.extend({}, {
		username : parseUser.get('username'),
		password : parseUser.get('password'),
		name : parseUser.get('name'),
		email : parseUser.get('email'),
		notificationEmails : parseUser.get('notificationEmails'),
		logoUrl : parseUser.get('logoUrl'),
		paidEvents : parseUser.get('paidEvents'),
		totalSavedEvents : parseUser.get('totalSavedEvents'),
		createdAt : parseUser.createdAt
	});
	
	console.log($scope.user);
}]);

controllerModule.controller('PurchaseCtrl', [
		'$scope',
		'$q',
		'$timeout',
		'$modal',
		function($scope, $q, $timeout, $modal) {

			var getType = function(eventCount, maxEvents) {
				var type = 'success';

				var percent = eventCount / maxEvents * 100;
				if (percent > 50)
					type = 'warning';
				if (percent > 75)
					type = 'danger';

				return type;
			}

			var reloadEventStatus = function() {

				$scope.eventStatus = {
					count : 0,
					max : 1000,
					type : ''
				};

				var parseUser = Parse.User.current().fetch().then(
						function(user) {

							var eventCount = user.get('totalSavedEvents');
							var maxEvents = user.get('paidEvents');

							console.log('paidEvents: ' + maxEvents);

							$scope.eventStatus.count = 0;
							$timeout(function() {
								$scope.eventStatus = {
									count : eventCount,
									max : maxEvents,
									type : getType(eventCount, maxEvents)
								};
							}, 500);
						});
			}

			reloadEventStatus();

			/* normal pris 10 øre pr. enhed */
			var calculateTotalAmount = function(price, numOfItems, discount) {
				var total = price * numOfItems;
				return (discount && discount > 0) ? total
						* (1 - (discount / 100)) : total;
			};

			var packages = {
				locale : { // changes based on locale
					currency : 'dkk',
					itemprice : 0.10,
				},
				small : {
					numOfItems : 5000,
					discount : 0,
				},
				medium : {
					numOfItems : 25000,
					discount : 10,
				},
				large : {
					numOfItems : 50000,
					discount : 20,
				}
			}

			$scope.packages = {

				small : angular.extend({}, packages.locale, packages.small,
						{
							name : 'Lille',
							description : 'GuardSwift',
							price : packages.small.numOfItems
									* packages.locale.itemprice,
							total : calculateTotalAmount(
									packages.locale.itemprice,
									packages.small.numOfItems,
									packages.small.discount),

						}),
				medium : angular.extend({}, packages.locale, packages.medium, {
					name : 'Medium',
					description : 'GuardSwift',
					price : packages.medium.numOfItems
							* packages.locale.itemprice,
					total : calculateTotalAmount(packages.locale.itemprice,
							packages.medium.numOfItems,
							packages.medium.discount),
				}),
				large : angular.extend({}, packages.locale, packages.large,
						{
							name : 'Stor',
							description : 'GuardSwift',
							price : packages.large.numOfItems
									* packages.locale.itemprice,
							total : calculateTotalAmount(
									packages.locale.itemprice,
									packages.large.numOfItems,
									packages.large.discount),
						})
			}

			$scope.buyPackage = function(selectedPackage) {

				var dialog = $modal.open({
					templateUrl : 'views/dialog/package_payment.html',
					controller : 'PaymentDialogCtrl',
					size : 'lg',
					resolve : {
						purchaseObject : function() {
							return $q.when(selectedPackage)
						},
						parseUser : function() {
							return Parse.User.current().fetch()
						}
					}
				});

				dialog.result.then(function() {
					// successful charge of creditcard
					$scope.eventStatus.max += selectedPackage.numOfItems;
					reloadEventStatus();

					$scope.eventsAdded = selectedPackage.numOfItems;

					console.log("success");
				}, function() {
					// dismissed

				});

			};

		}]);

controllerModule
		.controller(
				'PaymentDialogCtrl',
				function($scope, $modalInstance, $timeout, purchaseObject, parseUser) {
					
					$scope.purchaseObject = purchaseObject;
					$scope.receipt_email = parseUser.get('email');
					
					var addAlert = function(type, msg) {
						$scope.alert = {
							type : type,
							msg : msg
						};
					};

					$scope.closeAlert = function(index) {
						$scope.alert = '';
					};

					$scope.close = function() {
						if ($scope.paymentSucess) {
							$modalInstance.close($scope.purchaseResult);
						} else {
							$modalInstance.dismiss('close');
						}
					}

					// not used yet but could sum up before and after payment
					var usedEvents = parseUser.get('totalSavedEvents');
					var paidEvents = parseUser.get('paidEvents');
					
					var eventsDiff = paidEvents - paidEvents;
					
					var availableEventsBefore = Math.max(0, eventsDiff);
					var availableEventsAfter = Math.max(0, eventsDiff + purchaseObject.numOfItems);
					
					$scope.handleStripe = function(status, response) {

						if (response.error) {
							// there was an error. Fix it.
							console.log(response);

							$scope.processing = false;

							addAlert('danger', response.error);

						} else {
							// got stripe token, now charge it or smt
							var token = response.id
							console.log(token);

							var description = purchaseObject.description + " "
									+ purchaseObject.name + " " + + purchaseObject.numOfItems;

							$scope.amount = purchaseObject.total;
							// $scope.country = "DK";

							var chargeObject = {
								amount : 100 * $scope.amount,
								currency : purchaseObject.currency,
								card : token,
								description : description,
								//statement_descriptor : description.substring(0,
								//		21), // only
								// supports
								// 22
								// chars
								receipt_email : $scope.receipt_email
							}

							Parse.Cloud
									.run(
											"stripePayment",
											{
												chargeObject : chargeObject
											},
											function(results) {

												results.purchased = purchaseObject;

												$scope.purchaseResult = results;

												if (results
														&& results.status === "succeeded") {
													
													parseUser.set('paidEvents', (paidEvents + purchaseObject.numOfItems)).save().then(function() {
														
														$scope.paymentSucess = true;
														$scope.processing = false;
														
														addAlert('success',
														"Betaling gennemført")														
														
														
													}, function(error) {
														// refund and show error
														$scope.processing = false;
													});


												} else {

													$scope.processing = false;

													var errorMsg = (results && results.name)
															? results.name
															: '';
													addAlert(
															'danger',
															"Betaling afvist "
																	+ errorMsg
																	+ " - prøv igen eller kontakt administratoren");
												}
											});
						}
					}
				});
