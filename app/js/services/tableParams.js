'use strict';

var app = angular.module('GuardSwiftApp.services');

app.factory('TableParams', [
		'$filter',
		'ngTableParams',
		'$timeout',
		function($filter, ngTableParams, $timeout) {

			var factory = {};

			factory.StandardTable = function(options, dataFn, args) {
				
				var tableData = dataFn.apply(this, args) || [];
				var tableOptions = (options) ? options : {
					page : 1,
					count : 100
				};
				var table = new ngTableParams(tableOptions, {
					total : tableData.length, // length
					// of
					// data
					getData : function($defer, params) {
						console.log(args);
						var data = dataFn.apply(this, args) || tableData;
						console.log('GETDATA: ' + data.length);
						console.log(data);
						// use build-in angular filter
						var filteredData = params.filter() ? $filter('filter')(
								data, params.filter()) : data;
						var orderedData = params.sorting() ? $filter('orderBy')
								(filteredData, params.orderBy()) : data;

						params.total(orderedData.length); // set
						// total
						// for
						// recalc
						// pagination
						$defer.resolve(orderedData.slice((params.page() - 1)
								* params.count(), params.page()
								* params.count()));
					}
				});
				return {
					getParams : function() {
						return table;
					},
					load : function($scope, scopedData) {
						tableData = scopedData;
						$scope.$watch(function() {
							return tableData;
						}, function(n, o) {
							$timeout(function() {
								table.reload();
							});
						});
					},
				};
			};

			factory.LogsTable = function() {
				var tableData = [];
				var table = new ngTableParams({

					page : 1, // show first page
					count : 100, // count per page
					sorting : {
						createdAt : 'desc'
					}
				}, {
					total : tableData.length, // length
					// of
					// data
					getData : function($defer, params) {
						var data = tableData;
						// use build-in angular filter
						var filteredData = params.filter() ? $filter('filter')(
								data, params.filter()) : data;
						var orderedData = params.sorting() ? $filter('orderBy')
								(filteredData, params.orderBy()) : data;

						params.total(orderedData.length); // set
						// total
						// for
						// recalc
						// pagination
						$defer.resolve(orderedData.slice((params.page() - 1)
								* params.count(), params.page()
								* params.count()));
					}
				});
				return {
					getParams : function() {
						return table;
					},
					load : function($scope, scopedData) {
						tableData = scopedData;
						$scope.$watch(function() {
							return tableData;
						}, function(n, o) {
							$timeout(function() {
								table.reload();
							});
						});
					},
				};
			};
			
			factory.GroupingLogsTable = function() {
				var groupBy = function(item) { return ''; };
				var tableData = [];
				var table = new ngTableParams({

					page : 1, // show first page
					count : 50, // count per page
					sorting : {
						createdAt : 'desc'
					}
				}, {
					groupBy : function(item) {
						return groupBy(item);
					},
					total : tableData.length, // length
					// of
					// data
					getData : function($defer, params) {
						var data = tableData;
						// use build-in angular filter
						var filteredData = params.filter() ? $filter('filter')(
								data, params.filter()) : data;
						var orderedData = params.sorting() ? $filter('orderBy')
								(filteredData, params.orderBy()) : data;

						params.total(orderedData.length); // set
						// total
						// for
						// recalc
						// pagination
						$defer.resolve(orderedData.slice((params.page() - 1)
								* params.count(), params.page()
								* params.count()));
					}
				});
				return {
					getParams : function() {
						return table;
					},
					load : function($scope, scopedData, groupByExpr) {
//						console.log('load grouping table');
//						console.log(groupByExpr);
						groupBy = groupByExpr;
						tableData = scopedData;
						$scope.$watch(function() {
							return tableData;
						}, function(n, o) {
							$timeout(function() {
								table.reload();
							});
						});
					},
				};
			};

			return factory;

		}]);


