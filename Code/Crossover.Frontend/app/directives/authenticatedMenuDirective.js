//List all Comments added to a post

(function () {

    'use strict';

    angular.module('directives.authenticatedMenu', [
        'modules.common.services.service.security'
    ])

    .controller('authenticatedMenuController', authenticatedMenuController)
    .directive('authenticatedMenu', authenticatedMenuDirective);

    //************************************
    //  Diretiva
    //************************************

    //Injeta dependencias da diretiva
    authenticatedMenuDirective.$inject = [];
    authenticatedMenuController.$inject = ['securityService'];

    function authenticatedMenuController(securityService) {
        var vm = this;

        //Instancia variáveis que irão receber os dados
        vm.dados = {};

        //Referencia os metodos disponíveis
        vm.isAuthenticated = securityService.isAuthenticated;
    }

    function authenticatedMenuDirective() {
        return {
            restrict: 'E',
            controller: 'authenticatedMenuController',
            templateUrl: '/app/modules/common/views/authenticatedMenu.html',
            controllerAs: 'authMenu'
        }
    }

})();