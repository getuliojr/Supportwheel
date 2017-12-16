//List all Comments added to a post

(function () {

    'use strict';

    angular.module('shared.directives.compareTo', [

    ])


    .directive('compareTo', compareToDirective);

    //************************************
    //  Diretiva
    //************************************

    //Injeta dependencias da diretiva
    compareToDirective.$inject = [];

    function compareToDirective() {
        return {
            restrict: 'A',
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    }

})();