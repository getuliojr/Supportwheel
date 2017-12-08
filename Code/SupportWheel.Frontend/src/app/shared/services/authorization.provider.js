import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import securityService from './security.service.js';
import retryQueueService from './retryQueue.service.js';



class AuthorizationHelper {
    constructor(securityService, retryQueueService) {
        this.securityService = securityService;
        this.retryQueueService = retryQueueService;
    }

    //Verifica se o usuário está autenticado, e caso contrário solicita login
    isUserAuthenticated() {
        if (!this.securityService.isAuthenticated()) {
            return this.retryQueueService.pushRetryFn('unauthenticated-client', isUserAuthenticated);
        }
    }

    //Verifica se o usuário tem o Perfil necessário e caso contrário solicita login
    isUserinRoles(allowedRoles) {
        if (!this.securityService.isAuthenticated()) {
            return this.retryQueueService.pushRetryFn('unauthenticated-client', isUserinRoles, arguments);
        }

        var currentUser = this.securityService.currentUser();
        //Se não tiver um usuário, solicita autenticação
        if (!currentUser) {
            return retryQueueService.pushRetryFn('unauthenticated-client', isUserinRoles, arguments);
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
                return retryQueueService.pushRetryFn('unauthorized-client', isUserinRoles, arguments);
            }
        }
    }
}


AuthorizationProvider.$inject = ['AuthorizationHelper'];

class AuthorizationProvider {

    constructor(AuthorizationHelper) {
        this.authorizationHelper = AuthorizationHelper;
 
    }

    isUserAuthenticated() {
        return this.authorizationHelper.isUserAuthenticated();
    }
    isUserinRoles() {
        var allowedRoles = this.self.allowedRoles;
        return this.authorizationHelper.isUserinRoles(allowedRoles, "teste");
    }

}



AddResolveToState.$inject = ['$stateProvider', 'authorizationProvider'];

class AddResolveToState {

    constructor($stateProvider, authorizationProvider) {
        
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

}

export default angular
    .module('app.shared.services.authorization', [])
    .provider('authorizationProvider', AuthorizationProvider)
    .config(addResolveToState)
    .name;