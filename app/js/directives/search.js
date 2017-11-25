'use strict';

/* Directives */

var myApp = angular.module('GuardSwiftApp.directives');

myApp.directive('gsClientSelect', [
		'ParseClient',
		function(ParseClient) {
			return {
				restrict : "E",
				templateUrl : 'views/dropdown/select_client.html',
				scope : {
					value : "=ngModel",
					addressName : "=?",
					addressNumbers : "=?",
                    ngChange: '&'
				},
				link : function(scope, element, attrs) {
                    if (scope.ngChange) {
                    	scope.$watch('value', function(newVal, lastVal) {
                    		if (newVal !== lastVal) {
                            	scope.ngChange();
                            }
						}, true)

                    }

					ParseClient.fetchAll().then(function(result) {
						scope.clients = result;
					});

					scope.clientSelected = function(client) {
						if (client) {
							scope.addressName = client.addressName;
							console.log('setting address name '
									+ scope.addressName);

							// http://stackoverflow.com/questions/15590140/ng-list-input-not-updating-when-adding-items-to-array
							var addressNumbers = [];
							addressNumbers.push(client.addressNumber);
							scope.addressNumbers = addressNumbers;
							console.log('setting address numbers '
									+ scope.addressNumbers);

						}
					}
				}
			};
		}]);

myApp
		.directive('gsSearchBarDayDate',

		function() {
			return {
				restrict : 'E',
				templateUrl : 'views/logs/searchbar_day_date.html',
				scope : {
					searchResult : '&',
					/*
					 * searchOptions = { search : { parseObject : parseObject,
					 * parseQuery : parseQuery }, daysBack : 7, (optional)
					 * visible : true, (optional) searchOnLoad : true,
					 * (optional) }
					 */
					searchOptions : '=',
					daysBack : '@',
					searchOnLoad : '@' // TODO
				},
				controller : 'SearchBarDayDateCtrl',
				controllerAs : 'ctrl',
				bindToController : true,
				compile : function(element, attrs) {
					if (!attrs.searchResult) {
						console.error('missing search callback function');
					}
					if (!attrs.searchOptions) {
						console.error('missing searchOptions');
						attrs.visible = false;
					}
					attrs.daysBack = attrs.daysBack || "1";
					attrs.searchOnLoad = attrs.searchOnLoad || "true";

				}
			};
		})
		.controller(
				'SearchBarDayDateCtrl',
				[
						'$scope',
						'TimeStrings',
						'ParseSearch',
						function($scope, TimeStrings, ParseSearch) {

							var ctrl = this;
							
							console.log(ctrl);

							ctrl.dt_datefrom = new Date();
							ctrl.dt_dateto = new Date();

							ctrl.resultCount = 0;

							ctrl.dateOptionsFrom = {
								formatYear : 'yy',
								startingDay : 1,
								initDate : this.dt_datefrom
							};

							ctrl.dateOptionsTo = {
								formatYear : 'yy',
								startingDay : 1,
								initDate : this.dt_dateto
							};

							ctrl.format = 'dd-MMMM-yyyy';

							$scope.$watch('ctrl.daysBack', function(daysBack) {
								// search(ParseService, table, {
								// daysBack : daysBack,
								// groupBy : groupBy
								// });

								console.log(daysBack);

								ctrl.dt_datefrom = moment().subtract(daysBack,
										'day').toDate();
								ctrl.dt_dateto = moment().toDate();

								ctrl.search();

							});

							ctrl.search = function() {
								
								if (!ctrl.searchOptions || !ctrl.searchOptions.search) {
									console.error('missing searchOptions');
									return;									
								}
									

								console.log('searching from '
										+ ctrl.dt_datefrom + ' to '
										+ ctrl.dt_dateto);
								ctrl.searching = true;

								var searchSpecs = [].concat(ctrl.searchOptions.search);
								var searchPromises = [];
								
								angular
										.forEach(
												searchSpecs,
												function(searchSpec) {
													
													console.log(searchSpec);
													
													var parseObject = searchSpec.parseObject; // The class we want to search (StandardParseObject)
													var parseQuery = searchSpec.parseQuery; // Optional parseQuery
													
													ParseSearch
															.search(
																	parseObject,
																	moment(ctrl.dt_datefrom).set({hour:0,minute:0,second:0,millisecond:0}).toDate(),
																	moment(ctrl.dt_dateto).add(1, 'days').set({hour:0,minute:0,second:0,millisecond:0}).toDate(),
																	parseQuery)
															.then(
																	function(scopedObjects) {
																		ctrl.resultCount = scopedObjects.length;

																		ctrl.searching = false;

																		console
																				.log('found results: '
																						+ ctrl.resultCount);

																		// passing
																		// result
																		// to
																		// controller
																		if (!angular
																				.isUndefined(scopedObjects)) {
																			console
																					.log(scopedObjects);
																			ctrl
																					.searchResult({
																						result : scopedObjects,
																					});
																		}
																	},
																	function(error) {
																		console
																				.error(error);

																		ctrl.searching = false;
																	});

												});
							}

							ctrl.open_datefrom = function($event) {
								$event.preventDefault();
								$event.stopPropagation();

								ctrl.opened_datefrom = true;
								ctrl.opened_dateto = false;

							};

							ctrl.open_dateto = function($event) {
								$event.preventDefault();
								$event.stopPropagation();

								ctrl.opened_dateto = true;
								ctrl.opened_datefrom = false;

							};

							ctrl.daysBackOptions = [];
							TimeStrings.then(function(results) {

								console.log(results);

								var daysBack = results.daysBack;

								ctrl.daysBackOptions = [{
									text : daysBack[0],
									value : 1,
								}, {
									text : daysBack[1],
									value : 7,
								}, {
									text : daysBack[2],
									value : 14,
								}, {
									text : daysBack[3],
									value : 31,
								}, {
									text : daysBack[4],
									value : 93,
								}, {
									text : daysBack[5],
									value : 186,
								}, {
									text : daysBack[6],
									value : 365,
								}];

								ctrl.daysBack = 7;


							});
						}]);
