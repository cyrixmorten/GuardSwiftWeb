'use strict';

var app = angular.module('GuardSwiftApp.services');

app
		.factory(
				'ParseSearch',
				[function() {

//					var queryDaysBack = function(query, daysBack) {
//
//						if (daysBack) {
//							var now = new Date();
//							var timeBackMiliseconds = now.getTime() - 1000 * 60
//									* 60 * 24 * daysBack;
//							var searchFromDate = new Date(timeBackMiliseconds);
//							var searchToDate = now;
//
//							query.greaterThanOrEqualTo('createdAt',
//									searchFromDate);
//							query.lessThanOrEqualTo('createdAt', searchToDate);
//						}
//
//						return query;
//					};

					var queryDates = function(query, dateFrom, dateTo) {

						if (dateFrom)
							query.greaterThanOrEqualTo('createdAt', dateFrom);

						if (dateTo)
							query.lessThanOrEqualTo('createdAt', dateTo);

						return query;
					};

//					var searchDaysBack = function(ParseObject, daysBack) {
//						var queryAll = ParseObject.fetchAllQuery();
//						var query = queryDaysBack(queryAll, daysBack);
//						return ParseObject.fetchAllScoped(query);
//					};
//
//					var searchDaysBackWithQuery = function(ParseObject, existingQuery, daysBack) {
//						var query = queryDaysBack(existingQuery, daysBack);
//						return ParseObject.fetchAllScoped(query);
//					};

					var searchDates = function(ParseObject, dateFrom, dateTo) {
						var queryAll = ParseObject.fetchAllQuery();
						var query = queryDates(queryAll, dateFrom, dateTo);
						return ParseObject.fetchAll(query);
					};

					var searchDatesWithQuery = function(ParseObject, existingQuery, dateFrom, dateTo) {
						var query = queryDates(existingQuery, dateFrom, dateTo);
						return ParseObject.fetchAll(query);
					};

					var search = function(parseObject, dateFrom, dateTo, query) {
						
						
//						console.log(parseObject);
//						var parseObject = searchOptions.parseObject;
//						var query = searchOptions.query;
//						var daysBack = searchOptions.daysBack;
//						var dateFrom = searchOptions.dateFrom;
//						var dateTo = searchOptions.dateTo;

//						if (daysBack) {
//							if (query)
//								return searchDaysBackWithQuery(parseObject,
//										query, daysBack);
//
//							return searchDaysBack(parseObject, daysBack);
//						} else {
							if (query)
								return searchDatesWithQuery(parseObject, query,
										dateFrom, dateTo);

							return searchDates(parseObject, dateFrom, dateTo);
//						}
					};

					return {
						// searchDaysBack : function(ParseObject, daysBack) {
						// return searchDaysBack(ParseObject, daysBack);
						// },
						// searchDaysBackWithQuery : function(ParseObject,
						// query, daysBack) {
						// return searchDaysBackWithQuery(ParseObject, query,
						// daysBack);
						// },
						// searchDates : function(ParseObject, dateFrom, dateTo)
						// {
						// return searchDates(ParseObject, dateFom, dateTo);
						// },
						// searchDaysBackWithQuery : function(ParseObject,
						// query, dateFrom, dateTo) {
						// return searchDatesWithQuery(ParseObject, query,
						// dateFrom, dateTo);
						// }
						
						/*
						 * Performing search on parseObject restricted by dateFrom and dateTo
						 */
						search : function(parseObject, dateFrom, dateTo, query) {
							
							return search(parseObject, dateFrom, dateTo, query);
						}
					};
				}]);