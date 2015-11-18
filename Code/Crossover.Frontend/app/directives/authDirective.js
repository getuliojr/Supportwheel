//List all Comments added to a post

(function () {

    'use strict';

    angular.module('directives.auth', [
        'modules.common.services.service.security'
    ])

    .directive('auth', authDirective);

    //************************************
    //  Diretiva
    //************************************

    //Injeta dependencias da diretiva
    authDirective.$inject = [];

    function authDirective() {
        return {
            restrict: 'E',
            controller: 'AuthController',
            templateUrl: '/app/modules/common/views/auth.html',
            controllerAs: 'auth'
        }
    }

})();