import angular from 'angular';
import retryQueueService from './retryQueue.service.js';
import hubService from './hub.service.js';

InterceptorService.$inject = ['$q', '$localStorage', 'retryQueueService', '$injector', 'hubService'];

class InterceptorService {

    constructor($q, $localStorage, retryQueueService, $injector, hubService) {
        this.$q = $q;
        this.$localStorage = $localStorage;
        this.retryQueueService = retryQueueService;
        this.$injector = $injector;
        this.hubService = hubService;
    }

    request(config) {
        config.headers = config.headers || {};

        //Add Hub Connection ID if it exists
        let connectionId = this.hubService.getConnectionId();
        if (connectionId != undefined) {
            config.headers.ConnectionId = connectionId;
        }

        //Se tiver um token, injeta
        if (!!this.$localStorage.token) {
            config.headers.Authorization = 'Bearer ' + this.$localStorage.token.access_token;
        }
        return config;
    };

    //Intercepta erros de autenticação para solicitar login através de pop-up
    responseError(rejection) {
        if (rejection.status === 401) {

            if (rejection.config.url.indexOf("token") > -1) {
                //Se o erro de autenticação foi ao solicitar o token (logar), então sobe o erro ao invés de rejeitar
                return rejection;
            } else {
                //Recurso no servidor não autorizado, solicita login para o usuario

                return this.retryQueueService.pushRetryFn('unauthorized-server', function retryRequest() {
                    // We must use $injector to get the $http service to prevent circular dependency
                    return this.$injector.get('$http')(rejection.config);
                }).catch(function (canceledLogin) { return this.$q.reject(rejection); });
            }
        }

        return this.$q.reject(rejection);
    };
}

export default angular
    .module('app.shared.services.baseUrl', [])
    .service('interceptorService', InterceptorService)
    .name;