(function () {

    'use strict';

    angular.module('modules.common.services.factory.interceptor', [
        'modules.common.services.service.retryQueue'
    ])

    .factory('interceptorFactory', interceptorFactory)   

    //Injeta dependencias
    interceptorFactory.$inject = ['$q', '$localStorage', 'retryQueueService', '$injector', 'hubService'];

    //Funções
    function interceptorFactory($q, $localStorage, retryQueueService, $injector, hubService) {
 
        return {
            request: _request,
            responseError: _responseError
        }

        //**************
        // Funções
        //*************

        //Injeta o token
        function _request(config) {
            config.headers = config.headers || {};

            //Add Hub Connection ID if it exists
            var connectionId = hubService.getConnectionId();
            if (connectionId != undefined) {
                config.headers.ConnectionId = connectionId;
            }

            //Se tiver um token, injeta
            if (!!$localStorage.token) {
                config.headers.Authorization = 'Bearer ' + $localStorage.token.access_token
            }
            return config;
        };
 
        //Intercepta erros de autenticação para solicitar login através de pop-up
        function _responseError(rejection) {
            if (rejection.status === 401) {

                if (rejection.config.url.indexOf("token") > -1) {
                    //Se o erro de autenticação foi ao solicitar o token (logar), então sobe o erro ao invés de rejeitar
                    return rejection;
                } else {
                    //Recurso no servidor não autorizado, solicita login para o usuario

                    return retryQueueService.pushRetryFn('unauthorized-server', function retryRequest() {
                        // We must use $injector to get the $http service to prevent circular dependency
                        return $injector.get('$http')(rejection.config);
                    }).catch(function (canceledLogin) { return $q.reject(rejection); });
                }               
            }

            return $q.reject(rejection);
        };
        
    };

})();
