//DIRETIVA PARA RESTRINGIR UM DETERMINADO CAMPO A DETERMINADOS CARACTERES
angular.module('directives.restrict', [])

.directive('restrict', [
    function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {

                modelCtrl.$parsers.push(function (inputValue) {
                    var transformedInput = inputValue.replace(new RegExp(attrs.restrict, 'g'), '');
                    if (transformedInput != inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    return transformedInput;
                });
            }
        }
    } ]);

