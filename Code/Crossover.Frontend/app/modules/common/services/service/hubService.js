(function () {

    'use strict';

    angular.module('modules.common.services.service.hub', [
        'modules.common.services.value.constantes',
        'modules.common.services.service.baseUrl',
        'modules.common.services.service.mediator'
    ])

    .factory('hubService', hubService);

    //Injeta dependencias
    hubService.$inject = ['$rootScope', 'constEventosDb', 'Hub', 'baseUrlService', 'mediatorService'];

    function hubService($rootScope, constEventosDb, Hub, baseUrlService, mediatorService) {

        var hub = new Hub("ApiHub", {

            //client side methods
            listeners: {
                'inserted': function (resource, data) {
                    mediatorService.sendEvent(resource, constEventosDb.INSERIDO, data, true);
                },
                'updated': function (resource, data) {
                    mediatorService.sendEvent(resource, constEventosDb.ATUALIZADO, data, true);
                },
                'deleted': function (resource, data) {
                    mediatorService.sendEvent(resource, constEventosDb.REMOVIDO, data, true);
                }
            },

            //server side methods
            methods: ['subscribe', 'unsubscribe'],

            //handle connection error
            errorHandler: function (error) {
                console.log(error);
            },

            hubDisconnected: function () {
                if (hub.connection.lastError) {
                    hub.connection.start();
                }
            },

            logging: false,  //Log to the Console

            //specify a non default root
            rootPath: baseUrlService.getBaseUrl() + "signalr"

        });

        return {
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            getConnectionId: getConnectionId
        };

        //*********************
        //Helper Function
        //*********************

        function getConnectionId() {
            return hub.connection.id;
        }

        function subscribe(recurso) {
            hub.promise.then(function () {
                hub.subscribe(recurso);     //Subscribe in the server
            })
        };

        function unsubscribe(recurso) {
            hub.unsubscribe(recurso); //Calling a server method
        };

    }

})();
    

