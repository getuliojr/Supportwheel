(function () {

    'use strict';
    /**
     * @ngdoc overview
     * @name components.core.authenticatedMenu
     * @description
     *
     * # AuthenticatedMenu - Component #
     *
     * This module is responsible to show the menu with the itens allowed only for authenticated Users.
     * If the user is not authenticated, the menu is now shown.
     *
     * @example
       <pre>
        <authenticated-menu><authenticated-menu />
       </pre>
     */
    angular
        .module('components.core.authenticatedMenu', [
        'shared.services.service.security'
        ])

        .directive('authenticatedMenu', authenticatedMenuDirective)
        .controller('AuthenticatedMenuController', AuthenticatedMenuController)

    /**
     * @ngdoc directive
     * @name components.core.authenticatedMenu.directive:authenticatedMenu
     * @restrict 'E'
     * @description
     *
     * This directive render the menu in the screen if the user is authenticated.
     *
     */
    function authenticatedMenuDirective() {
        return {
            restrict: 'E',
            controller: 'AuthenticatedMenuController',
            templateUrl: 'app/components/core/authenticatedMenu/authenticatedMenu.html',
            controllerAs: 'authMenu'
        }
    }


    //Inject Controller Dependencies
    AuthenticatedMenuController.$inject = ['securityService'];

    /**
     * @ngdoc controller
     * @name components.core.authenticatedMenu.controller:AuthenticatedMenuController
     * @requires shared.services.service.security
     * @description
     *
     * This controller has just a method that checks if the user is or is not authenticated
     *
     */
    function AuthenticatedMenuController(securityService) {
        var vm = this;

        /**
        * @ngdoc function
        * @name isAuthenticated
        * @methodOf components.core.authenticatedMenu.controller:AuthenticatedMenuController
        * @returns {boolean} It returns TRUE if user is authenticated or FALSE if it is not.
        * @description
        * Check in the securityService if the user is authenticated.
        *
        * Internal: {@link shared.services.service.service:security securityService.isAuthenticated}
        */
        vm.isAuthenticated = securityService.isAuthenticated;
    }

})();