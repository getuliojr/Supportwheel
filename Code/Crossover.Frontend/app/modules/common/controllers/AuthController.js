(function () {

    'use strict';

    //Define o módulo
    angular
        .module('modules.common.controllers.auth', [
            'modules.common.services.service.security',
            'modules.common.services.factory.handleException',
            'modules.common.services.service.user',
            'modules.common.services.service.notification'
        ])
        .controller('AuthController', AuthController);

    //Injeta dependencias
    AuthController.$inject = ['securityService', 'userService', '$mdDialog', 'handleExceptionFactory', 'notificationService'];

    //Cria o módulo
    function AuthController(securityService, userService, $mdDialog, handleExceptionFactory, notificationService) {
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
        vm.signup = signup;


        //******************************
        //Abaixo métodos do controle
        //******************************

        function showSignup() {
            $mdDialog.show({
                controller: 'AuthController',
                controllerAs: 'auth',
                templateUrl: 'app/modules/common/views/signup.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true
            }).then(function () {
                console.log('signup then');

            });
          
        }
        
        function signup(user) {

            //Save User
            userService.salvar(user)
                .then(success, handleExceptionFactory);

            function success(inserted) {
                notificationService.show('success', "The user has been successfully created. Please login now to continue.");
                $mdDialog.hide();
            }
        }
    }
})();