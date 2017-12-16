(function () {

    'use strict';

    /**
     * @ngdoc overview
     * @name components.core.login
     * @description
     *
     * # Login - Component #
     *
     * This module is responsible to show the form so that the user can login. See the directive 
     * description for more details
     *
     * @example
       <pre>
        <login><login />
       </pre>
     */
    angular
        .module('components.core.login', [
            'shared.services.service.security'
        ])

        .directive('login', loginDirective)
        .controller('LoginController', LoginController);

    /**
     * @ngdoc directive
     * @name components.core.login.directive:login
     * @restrict 'E'
     * @description
     *
     * This directive render a login form for the user to login with e-mail and password.
     * It validades if the e-mail is valid
     *
     */
    function loginDirective() {
        return {
            restrict: 'E',
            controller: 'LoginController',
            templateUrl: 'app/components/core/login/login.html',
            controllerAs: 'login'
        }
    }

    //Injeta dependencias
    LoginController.$inject = ['securityService'];

    /**
     * @ngdoc controller
     * @name components.core.login.controller:LoginController
     * @requires shared.services.service.service:security
     * @description
     *
     * Responsable to make the login, getLoginReason and getLastAuthError available from the securityService
     *
     */
    function LoginController(securityService) {
        var vm = this;

        vm.data = {};

        /**
        * @ngdoc function
        * @name login
        * @methodOf components.core.login.controller:LoginController
        * @description
        * Sends user information to the server, it uses the method 'login' in the securityService.
        *
        * Internal: {@link shared.services.service.service:security#login securityService.login}
        */
        vm.login = securityService.login;

        vm.closeLogin = securityService.closeLogin;


        /**
        * @ngdoc function
        * @name loginReason
        * @methodOf components.core.login.controller:LoginController
        * @description
        * Gets the reason why a user is been required to login. It uses the method 'getLoginReason' in the securityService.
        *
        * Internal: {@link shared.services.service.service:security#getLoginReason securityService.getLoginReason}
        */
        vm.loginReason = securityService.getLoginReason;
        /**
        * @ngdoc function
        * @name loginError
        * @methodOf components.core.login.controller:LoginController
        * @description
        * Get the last error send by the application or by the server about the authentication attempt. 
        * It uses the method 'getLastAuthError' in the securityService.
        *
        * Internal: {@link shared.services.service.service:security#getLastAuthError securityService.getLastAuthError}
        */
        vm.loginError = securityService.getLastAuthError; //Recebe possíveis erros
     
    }
})();