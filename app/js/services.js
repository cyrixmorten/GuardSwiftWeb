    'use strict';

    /* Services */
    var app = angular.module('GuardSwiftApp.services', ['ngAnimate',
        'parse-angular', 'ngTableExport'])
        .run(['$q', '$window', function ($q, $window) {


        if (!angular.isUndefined($window.Parse) && angular.isObject($window.Parse)) {

            var Parse = $window.Parse;

            /// Create a method to easily access our object
            /// Because Parse.Object("xxxx") is actually creating an object and we can't access static methods

            Parse.Object.getClass = function (className) {
                return Parse.Object._classMap[className];
            };

            ///// CamelCaseIsh Helper
            var capitaliseFirstLetter = function (string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            };


            ///// Override orig extend
            var origObjectExtend = Parse.Object.extend;

            Parse.Object.extend = function (protoProps) {

                var newClass = origObjectExtend.apply(this, arguments);

                if (_.isObject(protoProps) && _.isArray(protoProps.attrs)) {
                    var attrs = protoProps.attrs;
                    /// Generate setters & getters
                    _.forEach(attrs, function (currentAttr) {

                        var field = capitaliseFirstLetter(currentAttr);

                        // Don't override if we set a custom setters or getters
                        if (!newClass.prototype['get' + field]) {
                            newClass.prototype['get' + field] = function () {
                                return this.get(currentAttr);
                            };
                        }
                        if (!newClass.prototype['set' + field]) {
                            newClass.prototype['set' + field] = function (data) {
                                this.set(currentAttr, data);
                                return this;
                            }
                        }

                    });
                }


                return newClass;
            }
        }
    }]);



