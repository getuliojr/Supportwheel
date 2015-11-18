(function () {

    'use strict';

    //Define o módulo
    angular
        .module('modules.common.controllers.auth', [
            'modules.common.services.service.security'
        ])
        .controller('AuthController', AuthController);

    //Injeta dependencias
    AuthController.$inject = ['securityService'];

    //Cria o módulo
    function AuthController(securityService) {
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


        //******************************
        //Abaixo métodos do controle
        //******************************

        function showSignup() {
            //TODO: show signup form
        }
        
    }
})();