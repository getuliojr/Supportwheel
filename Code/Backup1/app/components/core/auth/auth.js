(function () {

    'use strict';

     /**
     * @ngdoc overview
     * @name components.core.auth
     * @description
     *
     * # Auth - Component #
     *
     * This module is responsible to show the icon for the user to Log in or to Log out
     * When the user clicks in the icon 'Log in' it will show a modal with a form to enter credentials
     * When the user clicks in the icon 'Log out' it will clear all user authentication information in the app
     *
     * @example
       <pre>
        <auth></auth>
       </pre>
     */
    angular
        .module('components.core.auth', [
            'shared.services.service.security'
        ])

        .directive('auth', authDirective)
        .controller('AuthController', AuthController);

    /**
     * @ngdoc directive
     * @name components.core.auth.directive:auth
     * @restrict 'E'
     * @description
     *
     * This directive render the icons in the screen so the user can interact with the site, login-in or login-out.
     *
     */
    function authDirective() {
        return {
            restrict: 'E',
            controller: 'AuthController',
            templateUrl: 'app/components/core/auth/auth.html',
            controllerAs: 'auth'
        }
    }

    //Inject Dependencies
    AuthController.$inject = ['securityService'];

    /**
     * @ngdoc controller
     * @name components.core.auth.controller:AuthController
     * @requires shared.services.service.service:security
     * @description
     *
     * Responsable to show the interface for the user to login or logout
     *
     */
    function AuthController(securityService) {
        var vm = this;

        /**
        * @ngdoc function
        * @name currentUser
        * @methodOf components.core.auth.controller:AuthController
        * @returns {object} It returns the information about the current authenticated user.
        * @description
        * Check in the securityService if the user is logged and returns the current user information.
        *
        * {@link shared.services.service.service:security#currentUser securityService.currentUser}
        */
        vm.currentUser = securityService.currentUser;
        /**
        * @ngdoc function
        * @name isAuthenticated
        * @methodOf components.core.auth.controller:AuthController
        * @returns {boolean} It returns TRUE if user is authenticated or FALSE if it is not.
        * @description
        * Check in the securityService if the user is authenticated.
        *
        * {@link shared.services.service.service:security#isAuthenticated securityService.isAuthenticated}
        */
        vm.isAuthenticated = securityService.isAuthenticated;
        /**
        * @ngdoc function
        * @name logout
        * @methodOf components.core.auth.controller:AuthController
        * @description
        * It clear all information about the user in the app. It uses the method logout in the securityService.
        *
        * {@link shared.services.service.service:security#logout securityService.logout}
        */
        vm.logout = securityService.logout;
        /**
        * @ngdoc function
        * @name showLogin
        * @methodOf components.core.auth.controller:AuthController
        * @description
        * It open a modal with a form for the user to insert its credentials
        *
        * {@link shared.services.service.service:security securityService.showLogin}
        */
        vm.showLogin = securityService.showLogin;

    }
})();