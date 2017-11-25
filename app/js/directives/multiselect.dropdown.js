'use strict';

/* Directives */

var myApp = angular.module('GuardSwiftApp.directives');

myApp.directive('singleselectDropdown', ['$translate', function($translate) {
	return {
		link : function(scope, element, attrs) {

			element.multiselect({
				buttonClass : 'form-control',
				buttonWidth : 'auto',
				buttonContainer : '<div class="btn-group" />',
				maxHeight : 200,
				buttonText : function(options) {

					var label = '';
					if (options.length == 1) {
						label += options[0].text;
					}

					return label;// + ' <b class="caret"></b>';

				}
			});

			// Watch for any changes
			// to the length of our
			// select element
			scope.$watch(function() {
				return element[0].length;
			}, function() {
				element.multiselect('rebuild');
			});

			// Watch for any changes
			// from outside the
			// directive and refresh
			scope.$watch(attrs.ngModel, function() {
				element.multiselect('refresh');
			});

		}

	};
}]);

myApp.directive('singleselectDropdownTimeReset', ['$translate',
		function($translate) {
			return {
				link : function(scope, element, attrs) {
					$translate('IS_RESET_AT').then(function(translation) {

						element.multiselect({
							buttonClass : 'form-control',
							buttonWidth : 'auto',
							buttonContainer : '<div class="btn-group" />',
							maxHeight : 200,
							buttonText : function(options) {

								var label = ' ';
								if (options.length == 1) {
									label += options[0].text;
								}

								return label;// + ' <b class="caret"></b>';

							}
						});

						// Watch for any changes
						// to the length of our
						// select element
						scope.$watch(function() {
							return element[0].length;
						}, function() {
							element.multiselect('rebuild');
						});

						// Watch for any changes
						// from outside the
						// directive and refresh
						scope.$watch(attrs.ngModel, function() {
							element.multiselect('refresh');
						});
					});

				}

			};
		}]);

// myApp.directive('gsDropdownDays', function() {
// return {
// restrict : 'E',
// templateUrl : 'views/dropdown/multiselect_days.html',
// // scope : {
// // value : "=ngModel",
// // },
// controller : function($scope, TimeStrings) {
// console.log('gsDropdownDays');
// TimeStrings.then(function(timeStrings) {
// $scope.days = timeStrings.days;
// console.log('gsDropdownDays');
// console.log($scope);
//
// })
// }
// }
// });

myApp
		.directive(
				'multiselectDropdownInputDays',
				[
						'$translate',
						function($translate) {
							return {
								restrict : 'A',
								controller : function($scope, TimeStrings) {
									TimeStrings.then(function(timeStrings) {
										$scope.days = timeStrings.days;
									})
								},
								link : function(scope, element, attrs) {
									$translate(['DAYS', 'SELECT_ALL'])
											.then(
													function(translations) {
														element
																.multiselect({
																	buttonClass : 'form-control',
																	buttonWidth : 'auto',
																	buttonContainer : '<div class="btn-group" />',
																	includeSelectAllOption : true,
																	maxHeight : 200,
																	selectAllText : translations.SELECT_ALL,
																	buttonText : function(options) {

																		return options.length
																				+ ' '
																				+ translations.DAYS;
																		// + '
																		// <b
																		// class="caret"></b>';

																	}
																});
														

														// Watch for any changes
														// to the length of our
														// select element
														scope
																.$watch(
																		function() {
																			return element[0].length;
																		},
																		function() {
																			element
																					.multiselect('rebuild');
																		});

														// Watch for any changes
														// from outside the
														// directive and refresh
														scope
																.$watch(
																		attrs.ngModel,
																		function() {
																			element
																					.multiselect('refresh');
																		});

														if (attrs.ngDisabled) {
															scope
																	.$watch(
																			attrs.ngDisabled,
																			function(disable) {
																				// console.log('disable/enable
																				// ' +
																				// enable);
	
																				if (disable) {
	//																				console.log("disable");
																					element
																							.multiselect('disable');
																				} else {
	//																				console.log("enable");
																					element
																							.multiselect('enable');
																				}
																			});
														}

													});
								}

							};
						}]);

myApp
		.directive(
				'multiselectDropdownInputDistrictWatches',
				[
						'$translate',
						function($translate) {
							return {
								link : function(scope, element, attrs) {
									$translate(
											['DISTRICTWATCH',
													'NO_DISTRICTWATCHES',
													'DISTRICTWATCHES',
													'SELECT_ALL'])
											.then(
													function(translations) {
														element
																.multiselect({
																	buttonClass : 'form-control',
																	buttonWidth : 'auto',
																	buttonContainer : '<div class="btn-group" />',
																	includeSelectAllOption : true,
																	maxHeight : false,
																	selectAllText : translations.SELECT_ALL,
																	buttonText : function(options) {
																		// if
																		// (options.length
																		// == 0)
																		// {
																		// return
																		// 'None
																		// selected
																		// <b
																		// class="caret"></b>';
																		// }
																		// else
																		// if
																		// (options.length
																		// > 3)
																		// {

																		var title = options.length
																				+ ' '
																				+ translations.DISTRICTWATCHES;

																		if (options.length == 0) {
																			title = translations.NO_DISTRICTWATCHES;
																		}
																		if (options.length == 1) {
																			// title
																			// =
																			// options.length
																			// + '
																			// '
																			// +
																			// translations.DISTRICTWATCH;
																			title = options[0].text;
																		}

																		return title;
																		// + '
																		// <b
																		// class="caret"></b>';

																		// }
																		// else
																		// {
																		// var
																		// selected
																		// = '';
																		// options.each(function()
																		// {
																		// selected
																		// +=
																		// $(this).text()
																		// + ',
																		// ';
																		// });
																		// return
																		// selected.substr(0,
																		// selected.length
																		// -2) +
																		// ' <b
																		// class="caret"></b>';
																		// }
																	}
																});

														// Watch for any changes
														// to the length of our
														// select element
														scope
																.$watch(
																		function() {
																			return element[0].length;
																		},
																		function() {
																			element
																					.multiselect('rebuild');
																		});

														// Watch for any changes
														// from outside the
														// directive and refresh
														scope
																.$watch(
																		attrs.ngModel,
																		function() {
																			element
																					.multiselect('refresh');
																		});

													});
								}

							};
						}]);

myApp
		.directive(
				'multiselectDropdownInputTaskGroups',
				[
						'$translate',
						function($translate) {
							return {
								link : function(scope, element, attrs) {
									$translate(
											['CIRCUIT', 'NONE', 'CIRCUITS',
													'SELECT_ALL'])
											.then(
													function(translations) {
														element
																.multiselect({
																	buttonClass : 'form-control',
																	buttonWidth : 'auto',
																	buttonContainer : '<div class="btn-group" />',
																	includeSelectAllOption : true,
																	maxHeight : false,
																	selectAllText : translations.SELECT_ALL,
																	buttonText : function(options) {
																		// if
																		// (options.length
																		// == 0)
																		// {
																		// return
																		// 'None
																		// selected
																		// <b
																		// class="caret"></b>';
																		// }
																		// else
																		// if
																		// (options.length
																		// > 3)
																		// {

																		var title = options.length
																				+ ' '
																				+ translations.CIRCUITS;

																		if (options.length == 0) {
																			title = translations.NONE;
																		}
																		if (options.length == 1) {
																			title = options[0].text;
																		}

																		return title;
																		// + '
																		// <b
																		// class="caret"></b>';

																		// }
																		// else
																		// {
																		// var
																		// selected
																		// = '';
																		// options.each(function()
																		// {
																		// selected
																		// +=
																		// $(this).text()
																		// + ',
																		// ';
																		// });
																		// return
																		// selected.substr(0,
																		// selected.length
																		// -2) +
																		// ' <b
																		// class="caret"></b>';
																		// }
																	}
																});

														// Watch for any changes
														// to the length of our
														// select element
														scope
																.$watch(
																		function() {
																			return element[0].length;
																		},
																		function() {
																			element
																					.multiselect('rebuild');
																		});

														// Watch for any changes
														// from outside the
														// directive and refresh
														scope
																.$watch(
																		attrs.ngModel,
																		function() {
																			element
																					.multiselect('refresh');
																		});

													});
								}

							};
						}]);
