(function () {

    'use strict';

    //Define o módulo
    angular
        .module('modules.common.controllers.login', [
            'modules.common.services.service.security'
        ])
        .controller('LoginController', LoginController);

    //Injeta dependencias
    LoginController.$inject = ['notificacaoService', 'excecaoService', 'securityService'];

    //Cria o módulo
    function LoginController(notificacaoService, excecaoService, securityService) {
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


        //******************************
        //Abaixo métodos do controle
        //******************************


        
    }
})();