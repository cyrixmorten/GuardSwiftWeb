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

							console.log(scopedObject);
							
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

