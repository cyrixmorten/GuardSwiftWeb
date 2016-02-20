'use strict';

var app = angular.module('GuardSwiftApp.services');

app
		.factory(
				'StandardParseObject',
				[
						'$window',
						'$routeSegment',
						function($window, $routeSegment) {

							var StandardParseObject = function(construct) {

								var _this = this;

								var configuration = '';

								var hiddenData = {};
								var parseObjectHolder = [];

								// extinding parse using parse-angular-patch to
								// generate
								// setters/getters
								var ParseObject = Parse.Object.extend({
									className : construct.objectname,
									attrs : construct.attrs
								});

								this.setConfiguration = function(config) {
									console.log(config);
									configuration = config;
								}

								// returns a safe copy of the empty template
								this.getTemplate = function() {
									return angular
											.copy(construct.emptyTemplate);
								};

								this.addHiddenData = function(data) {
									hiddenData = angular.extend(hiddenData,
											data);
								};

								this.setHiddenData = function(data) {
									hiddenData = data;
								};
								
								this.setDefaultHiddenData = function() {
								    _this.setHiddenData(
									    	{
												ACL : new Parse.ACL(Parse.User.current()),
												owner : Parse.User.current()
											}
									    );
								};
								
								// apply default hidden data on creation
								_this.setDefaultHiddenData();
								
								// this.addHiddenData = function(propertyName,
								// propertyValue) {
								// hiddenData[propertyName] = propertyValue;
								// };

								/*
								 * returns an object with filled based on a
								 * parseObject and template_filled the
								 * parseObject will be set to the property
								 * parseobject
								 */
								function createScopedObject(parseObject) {

									var scopedObject = angular
											.extend(
													construct
															.filledTemplate(parseObject),
													{
														createdAt : parseObject.createdAt,
														id : parseObject.id,
														objectPointer : _this
																.getPointerObject(parseObject.id)
													});

									return scopedObject;
								};

								// needed to let child of array holder
								// push new values to array
								this.storeParseObject = function(parseObject) {
									parseObjectHolder[parseObject.id] = {
										object : parseObject,
										scopedObject : createScopedObject(parseObject)
									}
								};

								
								/*
								 * 
								 */
								// parseObject
								// store the objects on correct ParseObject
								this.storeParseObjects = function(parseObjects) {
									storeParseObjects(parseObjects);
									
								};

								function storeParseObjects(parseObjects) {
									angular
											.forEach(
													parseObjects,
													function(parseObject) {

														parseObjectHolder[parseObject.id] = {
															object : parseObject,
															scopedObject : createScopedObject(parseObject)
														}
													});
									// var holder = {
									// id : parseObject.id,
									// object : parseObject
									// };
									// parseObjectHolder.push(holder);
								};

								// expose for login/logout
								this.clearStoredParseObjects = function() {
									clearStoredParseObjects();
								}
								
								function clearStoredParseObjects() {
									parseObjectHolder = [];
								};

								/*
								 * Look up parseObject from scoped version of
								 * stored object
								 */
								this.getParseObject = function(scopedObject) {
									if (!scopedObject || !scopedObject.id)
										return null;

									var id = scopedObject.id;
									if (parseObjectHolder[id]) {
										return parseObjectHolder[id].object;
									}
								};

								/*
								 * Look up scoped version of stored object
								 */
								this.getScopedObject = function(parseObject) {

									if (!parseObject || !parseObject.id)
										return null;

									var id = parseObject.id;
									if (parseObjectHolder[id]) {
										return parseObjectHolder[id].scopedObject;
									}
									return createScopedObject(parseObject);
								};
								/*
								 * Returns the scoped version of the stored
								 * parseObjects
								 * 
								 * Optional parameter is an array of
								 * parseObjects, which selects the matching
								 * scoped parseObjects as the result set
								 */
								this.getScopedObjects = function(parseObjects) {
									var scopedObjects = [];
									if (parseObjects
											&& angular.isArray(parseObjects)) {
										// select based on parseObjects
										angular
												.forEach(
														parseObjects,
														function(parseObject) {

															var scopedObject = _this
																	.getScopedObject(parseObject);
															if (scopedObject) {
																scopedObjects
																		.push(scopedObject);
															} else {
																console
																		.error('id not found in store: '
																				+ id);
															}
														});
									} else {
										// return all
										for ( var id in parseObjectHolder) {
											if (parseObjectHolder
													.hasOwnProperty(id)) {
												var scopedObject = parseObjectHolder[id].scopedObject;
												scopedObjects
														.push(scopedObject);
											}
										}
									}
									return scopedObjects;
								};

								/*
								 * scopedObject - Instance of _this class
								 * holding the pointer array of interest
								 * TargetParseObject - Target object class used
								 * to scope the found objects columnName - Name
								 * of the column holding the array
								 */
								this.getScopedPointerArrayObjects = function(scopedObject, TargetParseObject, columnName) {
									console.log('getScopedPointerArrayObjects');
									console.log(scopedObject);
									console.log(TargetParseObject);
									console.log(columnName);
									// look up in case it has been updated
									scopedObject = _this.getScopedObject(scopedObject);
									console.log('after lookup');
									console.log(scopedObject);
									var arrayValues = scopedObject[columnName];
									
									if (arrayValues) {
										console.log('storing array values');
										console.log(arrayValues);
										TargetParseObject
												.storeParseObjects(arrayValues);
										return TargetParseObject
												.getScopedObjects(arrayValues);
									} else {
										console
												.error(construct.objectname
														+ " did not find pointer array named "
														+ columnName
														+ " - did you forget to include it?")
									}
								};
			
								this.getPointerObject = function(objectId) {
									if (angular.isUndefined(objectId))
										return;

									return {
										__type : "Pointer",
										className : construct.objectname,
										objectId : objectId
									};
								};

								this.getPointerObjectFromRouteParamId = function(paramName) {
									return _this
											.getPointerObject($routeSegment.$routeParams[paramName]);
								}
								

								this.getScopedObjectFromRouteParamId = function(paramName, includes) {
									var paramValue = $routeSegment.$routeParams[paramName];
									if (!paramValue) {
										console.error('paramValue missing for ' + paramName);
										return {};
									}
									
									return _this
											.get(paramValue
													,
													includes);
								};
								
								this.findScopedObjectEqualToParam = function(paramName, colName, includes) {
									
									console.log('findScopedObjectEqualToParam');
									
									var promise = new Parse.Promise();
									
									var paramValue = $routeSegment.$routeParams[paramName];
									if (!paramValue) {
										console.error('paramValue missing for ' + paramName);
										promise.reject('paramValue missing for ' + paramName);
									}
									if (!colName) {
										console.error('colName missing');
										promise.reject('colName missing');
									}
									
									
									var query = new Parse.Query(
											construct.objectname);
									query = addIncludes(query, includes);
									query.equalTo(colName, paramValue);
									
									query
											.first()
											.then(
													function(parseObject) {
														
														if (!parseObject) {
															promise.reject(new Parse.Error(Parse.Error.OBJECT_NOT_FOUND));
															return;
														}
														
														_this.storeParseObject(parseObject);
														var scopedObject = _this
																.getScopedObject(parseObject);
														promise
																.resolve(scopedObject);
													}, function(error) {
														console.error(error);
														promise.reject(error);
													});
									return promise;
								};



								// adds a new object using current properties
								this.add = function(createData) {

									var data = angular.copy(createData);

									var promise = new Parse.Promise();
									// ensure that the data adheres to the
									// template
									if (verifyDataAgainstTemplate(data)) {
										// align with filled template (in case
										// of
										// default values such as ACL)
										console.log(data);
										
										var aligned_data = alignDataWithTemplate(data);

										console.log(aligned_data);

										var ParseObject = new Parse.Object(
												construct.objectname);
										// set attributes
										for ( var attrname in aligned_data) {
											ParseObject.set(attrname,
													aligned_data[attrname])
										}
										console.log(configuration);

										// if configured to store in an array
										if (configuration
												&& configuration.toArray) {
											console
													.log("configured to save to array");
											var arrayHolderObject = configuration.toArray.parseObject;
											var arrayHolderScoped = configuration.toArray.scopedObject;
											// parseObject of arrayHolder
											var arrayHolder = arrayHolderObject
													.getParseObject(arrayHolderScoped);
											var arrayName = configuration.toArray.arrayName;
											if (arrayHolder && arrayName) {
												console
														.log("arrayName and arrayHolder set");
												ParseObject
														.save()
														.then(
																function(parseObject) {
																	// store locally
																	_this.storeParseObject(parseObject);
																	// now add
																	// to array
																	// of
																	// arrayHolder
																	arrayHolder
																			.add(
																					arrayName,
																					parseObject);
																	// and finally save
																	// arrayHolder
																	arrayHolder
																			.save()
																			.then(
																					function() {
																						// successfully
																						// saved
																						// to
																						// array
																						arrayHolderObject.storeParseObject(arrayHolder);
																						
																						promise
																								.resolve(parseObject);
																					},
																					function(error) {
																						promise
																								.reject(error);
																					});
																},
																function(error) {
																	promise
																			.reject(error);
																});

											} else {
												console
														.log("configured to store to array but missing 'arrayHolder' or 'arrayName'");
												console.log(configuration);
												promise.resolve(result);
											}
										} else {
											// else just store the object
											ParseObject
													.save()
													.then(
															function(result) {
																_this.storeParseObject(result);
																promise
																		.resolve(result);
															},
															function(error) {
																promise
																		.reject(error);
															});
										}
									} else {
										promise
												.reject("data does not match template");
									};

									return promise;
								};

								// updates an existing object
								this.update = function(scopedParseObject) {

									scopedParseObject = angular
											.copy(scopedParseObject);

									var holder = parseObjectHolder[scopedParseObject.id];

									if (!holder) {
										return new Parse.Promise.error(
												'No parseObjectHolder for scoped object: '
														+ scopedParseObject);
									}

									var parseObject = holder.object;

									if (parseObject) {
										// extract data and align with template
										var aligned_data = alignDataWithTemplate(
												scopedParseObject,
												construct
														.filledTemplate(parseObject));

										var savePromise = new Parse.Promise();

										parseObject
												.save(aligned_data)
												.then(
														function(result) {
															_this.storeParseObject(result);
															savePromise
																	.resolve(result);
														},
														function(error) {
															savePromise
																	.reject(error);
														});

										return savePromise;
									} else {
										console.error(scopedParseObject);
										return new Parse.Promise.error(
												'Did not find a parseObject with id '
														+ scopedParseObject.objectId);
									}
								};

								this.remove = function(objectId) {
									var promises = [];
									var holder = parseObjectHolder[objectId];
									if (!holder) {
										return new Parse.Promise.error(
												'No parseObjectHolder with id '
														+ objectId);
									}

									var parseObject = holder.object;
									if (parseObject) {
										console.error("performing archive");
										// if configured to store in an array
										if (configuration
												&& configuration.toArray) {
											console
													.log("configured to save to array");
											var arrayHolderObject = configuration.toArray.parseObject;
											var arrayHolderScoped = configuration.toArray.scopedObject;
											// parseObject of arrayHolder
											var arrayHolder = arrayHolderObject
													.getParseObject(arrayHolderScoped);
											var arrayName = configuration.toArray.arrayName;
											if (arrayHolder && arrayName) {
												console
														.log("arrayName and arrayHolder set");
												console
														.log("removing object from "
																+ arrayName
																+ " in:");
												console.log(parseObject);
												arrayHolder.remove(arrayName,
														parseObject);
												
												arrayHolderObject.storeParseObject(arrayHolder);
												
												promises.push(arrayHolder
														.save());
											} else {
												console
														.log("configured to store to array but missing 'arrayHolder' or 'arrayName'");
											}
										}

										parseObject.set('archive', true);

										promises.push(parseObject.save());
									} else {
										console
												.error('Did not find a parseObject with id '
														+ objectId);
										return new Parse.Promise.error(
												'Did not find a parseObject with id '
														+ objectId);
									}

									Parse.Promise
											.when(promises)
											.then(
													function() {
														console
																.log('delete successful, remove from local store');
														delete parseObjectHolder[objectId];
													});

									return Parse.Promise.when(promises);
								};

								this.fetchAllQuery = function() {
									var query = new Parse.Query(
											construct.objectname)
											.descending("createdAt");
									query
											.equalTo('owner', Parse.User
													.current());
									return query;
								};

								this.fetchAll = function(query) {
									query = (query) ? query : this
											.fetchAllQuery();

									var promise = new Parse.Promise();

									fetchAllRecursive(query, promise);

									return promise;
								};


								var fetchAllRecursive = function fetchRecursive(query, promise, loopCount, partialResults) {

									clearStoredParseObjects();
									loopCount = (loopCount) ? loopCount : 0;

                                    if (loopCount == 0) {

                                        query
                                            .equalTo('owner', Parse.User
                                                .current());


                                        query.doesNotExist('archive');

                                    }

									partialResults = (partialResults)
											? partialResults
											: [];

									var limit = 1000;
									var skip = limit * loopCount;
									console.log("skipping " + skip);


									query.limit(limit);
									query.skip(skip);
									query
											.find()
											.then(
													function(parseObjects) {
														var combinedParseObjects = parseObjects
																.concat(partialResults);
														if (parseObjects.length == limit) {
															console
																	.log("fetch more "
																			+ combinedParseObjects.length);
															fetchRecursive(
																			query,
																			promise,
																			loopCount + 1,
																			combinedParseObjects);
														} else {
															console
																	.log(combinedParseObjects.length);

															_this.storeParseObjects(combinedParseObjects);
															promise
																	.resolve(_this
																			.getScopedObjects(combinedParseObjects));
														}
													},
													function(error) {
														console
																.error(error.message);
														promise.reject(error);
													});
								};
								
								var addIncludes = function(query, includes) {
									if (includes) {
										if (angular.isArray(includes)) {
											angular.forEach(includes,
													function(include) {
														console.log("include: "
																+ include)
														query.include(include);
													});
										} else {
											console.log("include: " + includes)
											query.include(includes);
										}
									}
									
									return query;
								};

								this.get = function(objectId, includes) {
									console.log('get: ' + construct.objectname
											+ " - " + objectId);
									var promise = new Parse.Promise();
									var query = new Parse.Query(
											construct.objectname);
									query = addIncludes(query, includes);
									
									query
											.get(objectId)
											.then(
													function(parseObject) {
														_this.storeParseObject(parseObject);
														var scopedObject = _this
																.getScopedObject(parseObject);
														console.log('resolve');
														console
																.log(scopedObject);
														promise
																.resolve(scopedObject);
													}, function(error) {
														console.error(objectId);
														console.error(error);
														promise.reject(error);
													});
									return promise;
								};

								/**
								 * Removes properties that does not belong to
								 * the object Adds missing properties based on
								 * template
								 */
								function alignDataWithTemplate(data, optional_filled_template) {

									if (optional_filled_template) {
										// delete unknown properties
										for ( var attrname in data) {
											if (!optional_filled_template
													.hasOwnProperty(attrname)) {
												delete data[attrname];
												// console.log('delete ' +
												// attrname);
											}
										}
										// add missing properties
										for ( var attrname in optional_filled_template) {
											if (!data.hasOwnProperty(attrname)) {
												data[attrname] = optional_filled_template[attrname];
												// console.log('add filled ' +
												// attrname);
											}
										}
									}

									// add missing properties
									for ( var attrname in hiddenData) {
										if (!data.hasOwnProperty(attrname)) {
											data[attrname] = hiddenData[attrname];
											// console.log('add hidden ' +
											// attrname);
										}
									}

									// replace any scoped parseObjects with
									// their
									// respective pointer
									for ( var attrname in data) {
										var property = data[attrname];
										if (angular.isArray(property)) {
											var pointers = [];
											angular
													.forEach(
															property,
															function(value) {
																if (value.objectPointer) {
																	pointers
																			.push(value.objectPointer);
																}
															});
											if (pointers.length > 0) {
												data[attrname] = pointers;
											}
										} else {
											if (property
													&& property.objectPointer) {
												data[attrname] = property.objectPointer;
											}
										}
									}

									return data;
								}

								function objectKeysStringified(object) {
									return JSON.stringify(Object.keys(object)
											.sort());
								}

								function verifyDataAgainstTemplate(data) {
									var template = angular
											.copy(construct.emptyTemplate);

									console.log("matching data "
											+ objectKeysStringified(data)
											+ " with template "
											+ objectKeysStringified(template));
									// delete empty properties
									// allows adding partially filled objects
									for ( var attrname in template) {
										console.log('checking ' + attrname);
										if (!data.hasOwnProperty(attrname)) {
											console.log("deleting " + attrname);

											delete data[attrname];
											delete template[attrname];
											console.log('delete ' + attrname);
										} else {
											console.log("not deleting "
													+ attrname + " with value "
													+ data);
										}

									}

									var success = objectKeysStringified(data) === objectKeysStringified(template);
									if (!success) {
										// $window
										// .alert("Ooops!.. Der skete en
										// fej\n\nKan være nødvendigt at
										// genstarte siden (F5)");
										console
												.error("error at verifyDataAgainstTemplate;");
										throw "data does not match template "
												+ objectKeysStringified(data)
												+ " !== "
												+ objectKeysStringified(construct.emptyTemplate);
									}

									return success;
								}

								function capitalize(s) {
									return s[0].toUpperCase() + s.slice(1);
								}

								function decapitalize(s) {
									return s[0].toLowerCase() + s.slice(1);
								}

							};

							return StandardParseObject;

						}]);
