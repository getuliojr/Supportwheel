(function () {

    'use strict';

    angular.module('modules.common.services.provider.authorization', [
        'modules.common.services.service.security',
        'modules.common.services.service.retryQueue',
        'ui.router'
    ])

    .provider('authorization', authorizationProvider)
    .config(addResolveToState)

    //Injeta dependencias
    addResolveToState.$inject = ["$stateProvider", "authorizationProvider"];
  
    //Verifica o tipo de permissão requerida, autenticado ou perfil e adiciona os métodos resolve necessários.
    function addResolveToState($stateProvider, authorizationProvider) {

        $stateProvider.decorator('path', stateProvideDecorator);
    
        function stateProvideDecorator(state, parentFn) {

            //Se requer um usuário autenticado ou roles na rota, adiciona o método dinamicamente a ser utilizado
            if (!!state.self.requireAuthenticatedUser || !!state.self.allowedRoles) {
                if (state.self.resolve === undefined) {
                    state.self.resolve = {};
                }

                //Metodo para validar usuario autenticado
                if (!!state.self.requireAuthenticatedUser) {
                    state.self.resolve.requireAuthenticatedUser = authorizationProvider.isUserAuthenticated;
                }

                //Método para validar roles
                if (!!state.self.allowedRoles) {
                    state.self.resolve.requireRoles = authorizationProvider.isUserinRoles
                }
                state.resolve = state.self.resolve;
            }


            return parentFn(state);
        };
    }

    function authorizationProvider() {

        //API
        this.isUserAuthenticated = isUserAuthenticatedHelper;
        this.isUserinRoles = isUserinRolesHelper;
        this.$get = AuthorizationHelper;

        //Injeta dependencias
        AuthorizationHelper.$inject = ['securityService', 'retryQueueService', '$rootScope'];
        isUserAuthenticatedHelper.$inject = ['authorization'];
        isUserinRolesHelper.$inject = ['authorization'];

        function isUserAuthenticatedHelper(authorization) {
            return authorization.isUserAuthenticated();
        }
        function isUserinRolesHelper(authorization) {
            var allowedRoles = this.self.allowedRoles;
            return authorization.isUserinRoles(allowedRoles, "teste");
        }

        function AuthorizationHelper(securityService, retryQueueService, $rootScope) {

            //Api Pública
            var service = {
                //Métodos devem ser usados dentro do RESOLVE das rotas
                isUserAuthenticated: isUserAuthenticated,
                isUserinRoles: isUserinRoles
            };

            return service;


            //**********************
            //Funções
            //**********************
            //Verifica se o usuário está autenticado, e caso contrário solicita login
            function isUserAuthenticated() {
                if (!securityService.isAuthenticated()) {
                    return retryQueueService.pushRetryFn('unauthenticated-client', service.isUserAuthenticated);
                }
            }
            //Verifica se o usuário tem o Perfil necessário e caso contrário solicita login
            function isUserinRoles(allowedRoles) {
                if (!securityService.isAuthenticated()) {
                    return retryQueueService.pushRetryFn('unauthenticated-client', service.isUserinRoles, arguments);
                }

                var currentUser = securityService.currentUser();
                //Se não tiver um usuário, solicita autenticação
                if (!currentUser) {
                    return retryQueueService.pushRetryFn('unauthenticated-client', service.isUserinRoles, arguments);
                }

                //Lógica de acesso por Role
                if (allowedRoles != undefined) {
                    var allowAccess = false;
                    _.forEach(allowedRoles, function (n, key) {
                        if (_.findIndex(currentUser.perfisUsuario, 'strNomePerfil', n) > -1) {
                            allowAccess = true;
                        }
                    });

                    //Se não tiver acesso, bloqueia acesso através de pop-up de login
                    if (!allowAccess) {
                        return retryQueueService.pushRetryFn('unauthorized-client', service.isUserinRoles, arguments);
                    }
                }
            }
        }; 
    }


})();