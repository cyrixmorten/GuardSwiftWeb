'use strict';

/* Directives */

var myApp = angular.module('GuardSwiftApp.directives');

myApp.directive('autoFocus', function($timeout) {
	return {
		restrict : 'AC',
		link : function(_scope, _element) {
			$timeout(function() {
				_element[0].focus();
			}, 0);
		}
	};
});

myApp.directive('gsCrudPanelCreate', function() {
	return {
		restrict : 'E',
		scope : {
			title : '@'
		},
		transclude : true,
		templateUrl : 'views/crud/crud_panel_create.html'
	}
});

myApp.directive('gsCrudPanelUpdateRemove', function() {
	return {
		restrict : 'E',
		scope : {
			title : '@'
		},
		transclude : true,
		templateUrl : 'views/crud/crud_panel_update_remove.html',
	}
});

myApp
		.directive('gsCrud', function() {
			return {
				restrict : 'A',
				priority : 99,
				scope : {
					parseObject : "=",
					notifyAs : "@?",
					saving : "=?saving",
					updating : "=?updating",
					removing : "=?removing",
					editing : "=?editing",
				},
				controller : "MyCrudCtrl",
				controllerAs : "ctrl",
				bindToController : true,
			};
		})
		.directive(
				'gsCrudCreate',
				function() {
					return {
						restrict : 'EA',
						require : '^gsCrud',
						priority : 100,
						templateUrl : 'views/crud/crud_button_create.html',
						scope : {
							createData : "=data",
							success : "&",
							error : "&",
						},
						link : function(scope, element, attrs, crudCtrl) {
							scope.add = function() {
								crudCtrl.add(scope.createData, scope.success,
										scope.error);
							};

							scope.crudCtrl = crudCtrl;
						}
					};
				})
		// .directive('gsCrudInput', function() {
		// return {
		// restrict : 'A',
		// require : '^gsCrud',
		// priority : 100,
		// link : function(scope, element, attrs, crudCtrl) {
		//
		// scope.$watch('crudCtrl.modeEdit', function(val) {
		// console.log('modeEdit ' + crudCtrl.modeEdit);
		// if (crudCtrl.modeEdit) {
		// attrs.$set("readonly", false)
		// } else {
		// attrs.$set("readonly", true)
		// }
		// });
		// }
		// };
		// })
		.directive(
				'gsCrudUpdateDelete',
				function() {
					return {
						restrict : 'E',
						require : '^gsCrud',
						priority : 100,
						templateUrl : 'views/crud/crud_button_update_remove.html',
						scope : {
							scopedObject : "=",
							success : "&",
							error : "&",
						},
						link : function(scope, element, attrs, crudCtrl) {
							scope.crudCtrl = crudCtrl;

							scope.remove = function() {
								crudCtrl.remove(scope.scopedObject,
										scope.success, scope.error);
							};

							scope.edit = function() {
								scope.scopedObject = angular
										.copy(scope.scopedObject);
								scope.backup_scopedObject = angular
										.copy(scope.scopedObject);
								crudCtrl.edit(scope.scopedObject);
							}

							scope.cancel = function() {
								scope.scopedObject = scope.backup_scopedObject;
								crudCtrl.cancel(scope.scopedObject);
							}

							scope.update = function() {
								crudCtrl.update(scope.scopedObject,
										scope.success, scope.error);
							}

						}
					};
				})
		.directive(
				'gsCrudUpdate',
				function() {
					return {
						restrict : 'E',
						require : '^gsCrud',
						priority : 100,
						templateUrl : 'views/crud/crud_button_update.html',
						scope : {
							scopedObject : "=",
							success : "&",
							error : "&",
						},
						link : function(scope, element, attrs, crudCtrl) {
							scope.crudCtrl = crudCtrl;

							scope.update = function() {
								crudCtrl.update(scope.scopedObject,
										scope.success, scope.error);
							}

						}
					};
				})
		.controller(
				'MyCrudCtrl',
				[
						'$rootScope',
						'$timeout',
						'$translate',
						'$modal',
						'focus',
						'Notification',
						function($rootScope, $timeout, $translate, $modal, focus, Notification) {

							var ctrl = this;

							$translate(
									['ELEMENT', 'SAVED', 'UPDATED', 'DELETED',
											'AN_ERROR_OCCURED'])
									.then(
											function(translations) {

												// init variables
												var ParseObject = ctrl.parseObject;
												
												var notifyAs = ctrl.notifyAs
														|| translations.ELEMENT;
												
												ctrl.editing = false;
												ctrl.updating = false;
												ctrl.saving = false;

												// expose API
												ctrl.add = function(data, successCallback, errorCallback) {
													if (angular
															.isUndefined(data)) {
														console
																.error('crud add requires a createData parameter')
														return;
													}
													ctrl.saving = true;
													ParseObject
															.add(data)
															.done(
																	function() {
																		if (successCallback) {
																			successCallback();
																		}
																		focus('addSuccess');
																		$rootScope
																				.$broadcast('addSuccess');
																		Notification
																				.success(notifyAs
																						+ " "
																						+ translations.SAVED);
																	})
															.fail(
																	function(error) {
																		if (errorCallback) {
																			errorCallback(error)
																		}
																		Notification
																				.error(translations.AN_ERROR_OCCURED);
																		console
																				.log(error);
																	})
															.always(
																	function() {
																		ctrl.saving = false;
																	});
												};

												ctrl.edit = function(scopedObject) {
													ctrl.editing = true;
//													ctrl.editObject = scopedObject;
												};

												ctrl.cancel = function(scopedObject) {
													ctrl.editing = false;
//													ctrl.editObject = scopedObject;
												};

												ctrl.update = function(updatedScopedObject, successCallback, errorCallback) {
													ctrl.updating = true;
													ParseObject
															.update(
																	updatedScopedObject)
															.done(
																	function() {
																		if (successCallback) {
																			successCallback();
																		}
																		focus('updateSuccess');
																		$rootScope
																				.$broadcast('updateSuccess');
																		Notification
																				.primary(notifyAs
																						+ " "
																						+ translations.UPDATED);
																	})
															.fail(
																	function(error) {
																		if (errorCallback) {
																			errorCallback(error)
																		}
																		Notification
																				.error(translations.AN_ERROR_OCCURED);
																		console
																				.log(error);
																	})
															.always(
																	function() {
																		ctrl.updating = false;
																	});
												};

												ctrl.remove = function(scopedObject, successCallback, errorCallback) {
													var yesnoDialog = $modal
															.open({
																templateUrl : 'views/dialog/delete.html',
																controller : 'ConfirmActionModalCtrl',
																size : 'sm',
																resolve : {
																	itemType : function() {
																		return notifyAs
																	},
																	itemName : function() {
																		return scopedObject.name
																				|| ''
																	}
																}
															});

													yesnoDialog.result
															.then(
																	function() {
																		ctrl.removing = true;
																		ParseObject
																				.remove(
																						scopedObject.id)
																				.done(
																						function() {
																							if (successCallback) {
																								successCallback();
																							}
																							focus('deleteSuccess');
																							$rootScope
																									.$broadcast('deleteSuccess');
																							Notification
																									.error(notifyAs
																											+ " "
																											+ translations.DELETED);
																						})
																				.fail(
																						function(error) {
																							if (errorCallback) {
																								errorCallback(error)
																							}
																							Notification
																									.error(translations.AN_ERROR_OCCURED);
																							console
																									.log(error);
																						})
																				.always(
																						function() {
																							ctrl.removing = false;
																						});
																	},
																	function() {
																		// $log
																		// .info('Modal
																		// dismissed
																		// at: '
																		// + new
																		// Date());
																	});
												}
											});

						}]);
