'use strict';

/* Controllers */

var controllerModule = angular.module('GuardSwiftApp.controllers');

controllerModule.controller('StandardCRUDCtrl', ['$scope', 'TableParams',
		'ParseObject', function($scope, TableParams, ParseObject) {

			$scope.parseObject = ParseObject;
			$scope.createData = ParseObject.getTemplate();

			var table = TableParams.StandardTable({
				page : 1,
				count : 100,
				sorting : (ParseObject.sorting) ? ParseObject.sorting : {},
			}, ParseObject.getScopedObjects);

			$scope.tableParams = table.getParams();

			$scope.notifyDataSetChanged = function() {
				$scope.tableParams.reload();

				// clear entered data after successful add
				$scope.createData = ParseObject.getTemplate();
			}

			$scope.handleError = function(error) {
				console.error("I should deal with an error here");
				console.error(error);
			}

		}]);

controllerModule
		.controller('ParseDetailsCtrl',
				[
						'$scope',
						'ParseObject',
						'scopedObject',
						function($scope, ParseObject, scopedObject) {

							$scope.parseObject = ParseObject;
							$scope.scopedObject = scopedObject;

							$scope.$on('updateSuccess', function() {
								// look up updated object
								$scope.scopedObject = ParseObject
										.getScopedObject(scopedObject);
							});

//							console.error($scope);
							
							// TODO move to directive
							$scope.richText = {
								customMenu : [
										['bold', 'italic', 'underline',
												'strikethrough'],
										['font'],
										['font-size'],
										['font-color', 'hilite-color'],
										['remove-format'],
										['ordered-list', 'unordered-list',
												'outdent', 'indent'],
										['left-justify', 'center-justify',
												'right-justify'],
										['quote', 'paragragh'], []]
							};

						}]);

/*
 * Case: Parse class A holds an array of pointers P to class B, B1..Bn. Goal:
 * Modify the set B1..Bn while keeping P in sync when add/delete is performed
 * 
 * This controller requires 3 parameters to be resolved:
 * 
 * ParentParseObject - The parse class holding the pointer array (A)
 * scopedParentObject - Scoped instance of ParentParseObject holding array of
 * interest arrayName - Name of the column holding the pointer array (P)
 * ParseObject - The parse class object to modify (B)
 * 
 */
controllerModule
		.controller(
				'ParseArrayPointerCtrl',
				[
						'$scope',
						'TableParams',
						'ParentParseObject',
						'scopedParentObject',
						'ParseObject',
						'arrayName',
						function($scope, TableParams, ParentParseObject, scopedParentObject, ParseObject, arrayName) {

							$scope.parseObject = ParseObject;
							$scope.createData = ParseObject.getTemplate();

							ParseObject.setConfiguration({
								toArray : {
									parseObject : ParentParseObject,
									scopedObject : scopedParentObject,
									arrayName : arrayName
								}
							});

							var table = TableParams
									.StandardTable(
											{
												page : 1,
												count : 100,
												sorting : (ParseObject.sorting)
														? ParseObject.sorting
														: {},
											},
											ParentParseObject.getScopedPointerArrayObjects,
											[scopedParentObject, ParseObject,
													arrayName]);

							$scope.tableParams = table.getParams();

							$scope.notifyDataSetChanged = function() {
								$scope.tableParams.reload();

								// clear entered data after successful add
								$scope.createData = ParseObject.getTemplate();
							}

							$scope.handleError = function(error) {
								console
										.error("I should deal with an error here");
								console.error(error);
							}

						}]);

controllerModule.controller('ChildCtrl', ['$scope', function($scope) {
	$scope = $scope.$parent;
	console.error($scope);
}]);
//
// controllerModule
// .controller(
// 'CRUDCtrl',
// [
// '$rootScope',
// '$scope',
// '$q',
// '$timeout',
// '$modal',
// function($rootScope, $scope, $q, $timeout, $modal) {
//
// $scope.ParseCrud = {};
// $scope.crudObjects = [];
//
// var crudIndex = 0;
// // var beforeEditCrudObject = {};
// // var beforeSaveCrudObject = {};
//
// // function replaceCrudObject(object,
// // performScoping) {
// // console.log(object);
// // if (performScoping) {
// // $scope.crudObjects[crudIndex] = $scope.ParseCrud
// // .getScopeFriendlyObject(object);
// // } else {
// // $scope.crudObjects[crudIndex] = object;
// // }
// // };
//
// function setCrudIndex(scopedParseObject) {
// // crudIndex = $scope.crudObjects
// // .indexOf(scopedParseObject);
// // console.log("setCrudIndex");
// // console.log($scope.crudObjects);
//
// var result = null;
// var index = 0;
// angular
// .forEach(
// $scope.crudObjects,
// function(object) {
// // console.log("iteration "
// // + index);
// // console.log(object.objectId
// // +" "+
// // scopedParseObject.objectId);
// if (object.objectId == scopedParseObject.objectId) {
// crudIndex = index;
// result = $scope.crudObjects[index];
// }
// index++;
// });
//
// return result;
// };
//
// $rootScope.$on('routeSegmentChange', function() {
//
// // $scope.createData = ($scope.ParseCrud && $scope.ParseCrud.getTemplate()) ?
// $scope.ParseCrud.getTemplate() : {};
// $scope.editData = {};
//
// $scope.performingEdit = false;
//
// });
//
// // $scope.$on('set-crudobject',
// // function(event, crudObject) {
// // $scope.ParseCrud = crudObject;
// // });
//
// $scope.init = function(ParseObject, scopedObjects, table, tableParams) {
//								
// $scope.ParseCrud = ParseObject;
// $scope.crudObjects = scopedObjects;
//								
// $scope.createData = ParseObject.getTemplate();
//								
//								
// if (table && tableParams) {
// $scope.tableParams = tableParams;
// table.load($scope,
// scopedObjects);
// }
// };
//
// // $scope.loadData = function(query) {
// //
// // var defer = $q.defer();
// //
// // $scope.createData = $scope.ParseCrud
// // .getTemplate();
// //
// // $scope.ParseCrud.fetchAllScoped(query).then(
// // function(result) {
// //
// // $scope.crudObjects = result;
// //
// // defer.resolve(result);
// //
// // }, function(error) {
// // defer.reject(error);
// // });
// // return defer.promise;
// // };
//
// $scope.add = function(crudHeader) {
//
// $scope.ParseCrud
// .add($scope.createData)
// .then(
// function(result) {
// var scopedParseObject = $scope.ParseCrud
// .getScopeFriendlyObject(result);
//
// $scope.crudObjects
// .push(scopedParseObject);
//														
//
// console
// .log("Add "
// + $scope.crudObjects.length);
// // reset createData
// $scope.createData = $scope.ParseCrud
// .getTemplate();
//
// // $rootScope.$broadcast(
// // 'crud-added',
// // scopedParseObject);
// if ($scope.tableParams)
// $scope.tableParams
// .reload();
//													
// $scope.$digest;
// },
// function(error) {
// alert(JSON.stringify(error));
// $scope.createData = {};
// });;
// };
//
// $scope.edit = function(scopedParseObject) {
//
// setCrudIndex(scopedParseObject);
//
// // keep a copy of the crudObject in it's current
// // state
// // angular.copy(scopedParseObject,
// // beforeEditCrudObject);
//
// scopedParseObject.$edit = true;
// $scope.performingEdit = true;
// };
//
// $scope.cancel = function(scopedParseObject) {
//
// // var template =
// // $scope.ParseCrud.getTemplate();
//
// // for ( var attrname in template) {
// // if (typeof template[attrname] !== 'object') {
// // scopedParseObject[attrname] =
// // beforeEditCrudObject[attrname];
// // }
// // }
//
// // $rootScope.$broadcast('crud-canceled',
// // scopedParseObject);
//
// scopedParseObject.$edit = false;
// scopedParseObject.$updating = false;
// $scope.performingEdit = false;
// };
//
// $scope.save = function(scopedParseObject) {
//
// // console.log("save");
// // console.log(scopedParseObject);
// // console.log(scopedParseObject.objectId);
// // console.log("--");
// // angular.copy(scopedParseObject,
// // beforeSaveCrudObject);
// var crudScopedObject = setCrudIndex(scopedParseObject);
//
// console.log(crudScopedObject);
// if (!crudScopedObject)
// throw "Object not found: "
// + scopedParseObject;
//
// // console.log(beforeSaveCrudObject);
//
// $scope.performingUpdate = true;
// $scope.performingEdit = false;
//
// $scope.ParseCrud
// .update(crudScopedObject)
// .then(
// function(result) {
// // update the scoped
// // object
//
// // console.log("updated");
// // console.log(result);
// // result.objectId =
// // scopedParseObject.objectId;
// // scopedParseObject =
// // $scope.ParseCrud.getScopeFriendlyObject(result);
// $scope.crudObjects[crudIndex] = result;
//
// // console.log("done");
// // console.log($scope.crudObjects[crudIndex]);
//
// $rootScope.$broadcast('crud-saved', $scope.crudObjects[crudIndex]);
// if ($scope.tableParams)
// $scope.tableParams
// .reload();
//
// $scope.performingUpdate = false;
//
// },
// function(error) {
//
// alert(JSON.stringify(error));
//
// $scope.performingUpdate = false;
//
// });
//
// };
//
// $scope.remove = function(scopedParseObject) {
//
// setCrudIndex(scopedParseObject);
//
// // console.log("removing");
// // console.log(scopedParseObject);
//
// scopedParseObject.$delete = false;
//
// var modalInstance = $modal
// .open({
// templateUrl : 'views/dialog/delete.html',
// controller : ModalSimpleOkCancelInstanceCtrl,
//
// resolve : {
// name : function() {
// return scopedParseObject.name
// || scopedParseObject.item
// || scopedParseObject.info
// || scopedParseObject.id;
// }
// }
//
// });
//
// modalInstance.result
// .then(function() {
//
// scopedParseObject.$edit = false;
// scopedParseObject.$updating = true;
// scopedParseObject.$delete = true;
// $scope.performingUpdate = true;
//
// $scope.ParseCrud
// .remove(scopedParseObject)
// .then(
// function(result) {
//
// $scope.crudObjects
// .splice(
// crudIndex,
// 1);
//																	
//
// // $rootScope
// // .$broadcast('crud-deleted');
// if ($scope.tableParams)
// $scope.tableParams
// .reload();
//
// $scope.performingUpdate = false;
//																
// $scope.$digest;
//
// },
// function(error) {
// console
// .log(error);
// // TODO show
// // information
// // about
// // the
// // error
// $scope.performingUpdate = false;
// });
// });
// };
//
// }]);
//
// var ModalSimpleOkCancelInstanceCtrl = function($scope, $modalInstance, name)
// {
//
// $scope.name = name;
//
// $scope.ok = function() {
// $modalInstance.close(true);
// };
//
// $scope.cancel = function() {
// $modalInstance.dismiss('cancel');
// };
// };
