//List all Comments added to a post

(function () {

    'use strict';

    angular.module('directives.auth', [
        'modules.common.services.service.security'
    ])

    .controller('authController', authController)
    .directive('auth', authDirective);

    //************************************
    //  Diretiva
    //************************************

    //Injeta dependencias da diretiva
    authDirective.$inject = [];
    authController.$inject = ['securityService'];

    function authController(securityService) {
        var vm = this;

        //Instancia variáveis que irão receber os dados
        vm.dados = {};

        //Referencia os metodos disponíveis
        vm.currentUser = securityService.currentUser;
        vm.isAuthenticated = securityService.isAuthenticated;
        vm.login = securityService.login;
        vm.logout = securityService.logout;
        vm.showLogin = securityService.showLogin;
        vm.authReason = securityService.getLoginReason;
        vm.authError = securityService.getLastAuthError; //Recebe possíveis erros
        vm.showSignup = showSignup;

        function showSignup() {
            //TODO: show signup form
        }
    }

    function authDirective() {
        return {
            restrict: 'E',
            controller: 'authController',
            templateUrl: '/app/modules/common/views/auth.html',
            controllerAs: 'auth'
        }
    }

})();