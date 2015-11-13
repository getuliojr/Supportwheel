//O objetivo é abrir uma caixa de diálogo para o usuário confirmar uma ação.

//********************************************************************
//   Modal de Confirmação 
//********************************************************************
// Parâmetros que aceita receber:
// - title: título : Padrão: 'Confirma ?'
// - message: mensagem
// - okButton: Mensagem para o botão de confirmação: Padrão: 'Sim'
// - cancelButton: Mensagem para o botão de cancelar: Padrão: 'Não'
//********************************************************************

(function () {

    'use strict';

    var clickConfirmDirective = angular.module('directives.clickConfirm', [
        'ui.bootstrap',
        'directives.clickConfirmTemplate'
    ]);

    clickConfirmDirective.controller('clickConfirmController', clickConfirmController);
    clickConfirmDirective.directive('clickConfirm', directive);


    //************************************
    // Controller da Diretiva
    //************************************

    //Injeta dependencias do controller
    clickConfirmController.$inject = ['$scope', '$modalInstance', 'confirmationParams'];

    function clickConfirmController($scope, $modalInstance, confirmationParams) {

        $scope.confirmationParams = confirmationParams;

        $scope.confirm = function () {
            $modalInstance.close(); //Promise is resolved
        };

        $scope.cancel = function () {
            $modalInstance.dismiss(); //Promise is rejected
        };
    }


    //************************************
    //  Diretiva
    //************************************

    //Injeta dependencias da diretiva
    directive.$inject = ['$modal'];

    function directive($modal) {
        return {
            restrict: 'A',
            priority: 100,
            link: {
                //dentro do 'pre' para garantir que irá acontecer antes do ng-click
                pre: function (scope, element, attrs) {
                    var options = angular.extend({}, scope.$eval("(" + attrs.clickConfirm + ")"));
                    var dialogConfirmation = function (title, message, okButton, cancelButton) {
                        var modal = $modal.open({
                            templateUrl: 'diretivas/templates/clickConfirm.htm',
                            keyboard: true,
                            dialogClass: 'modal-confirm',
                            resolve: {
                                confirmationParams: function () {
                                    return {
                                        title: title ? title : 'Confirma ?',
                                        okButton: okButton ? okButton : 'Sim',
                                        cancelButton: cancelButton ? cancelButton : 'Não',
                                        message: message ? message : 'Tem certeza que quer continuar com a ação ?'
                                    };
                                }
                            },
                            controller: 'clickConfirmController'
                        });

                        return modal.result;
                    }

                    //Cria o evento para o click
                    element.bind('click touchstart', function (e) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        dialogConfirmation(options.title, options.message,
                        options.okButton, options.cancelButton).then(function () {
                            //Clicked OK
                            scope.$eval("(" + attrs.ngClick + ")");
                        }, function () {
                            //Clicked on Cancel
                        });
                    });
                }
            }
        }
    }
    

    //Template que está sendo utilizado para abrir o modal, incluído no código para facilitar transportar o código
    angular.module("directives.clickConfirmTemplate", []).run(["$templateCache", function ($templateCache) {
        $templateCache.put("diretivas/templates/clickConfirm.htm",
            "<div class=\"modal-header\">\n" +
            "    <button type=\"button\" class=\"close\" data-ng-click=\"cancel()\" aria-hidden=\"true\">&times;</button>\n" +
            "    <h3>{{ confirmationParams.title }}</h3>\n" +
            "</div>\n" +
            "<div class=\"modal-body\">\n" +
            "    <div class=\"row\">\n" +
            "        <div class=\"col-xs-2 hidden-xs\">\n" +
            "            <i class=\"fa fa-exclamation-triangle\" style=\"font-size:50px;color:rgb(250, 125, 9);\"></i>\n" +
            "        </div>\n" +
            "        <div class=\"col-xs-10\">\n" +
            "            {{ confirmationParams.message }}\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</div>\n" +
            "<div class=\"modal-footer\">\n" +
            "    <button class=\"btn btn-primary\" ng-click=\"confirm()\">{{confirmationParams.okButton}}</button>\n" +
            "    <button class=\"btn btn-default\" ng-click=\"cancel()\">{{confirmationParams.cancelButton}}</button>\n" +
            "</div>"
        );
    }]);

})();