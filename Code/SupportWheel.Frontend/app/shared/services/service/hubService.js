(function () {

    'use strict';

    angular.module('shared.services.service.hub', [
        'shared.services.value.constantes',
        'shared.services.service.baseUrl',
        'shared.services.service.mediator'
    ])

    .factory('hubService', hubService);

    //Injeta dependencias
    hubService.$inject = ['$rootScope', 'constEventosDb', 'Hub', 'baseUrlService', 'mediatorService'];

    function hubService($rootScope, constEventosDb, Hub, baseUrlService, mediatorService) {

        var hub = new Hub("ApiHub", {

            //client side methods
            listeners: {
                'inserted': function (resource, data) {
                    mediatorService.sendEvent(resource, constEventosDb.INSERTED, data, true);
                },
                'updated': function (resource, data) {
                    mediatorService.sendEvent(resource, constEventosDb.UPDATED, data, true);
                },
                'deleted': function (resource, data) {
                    mediatorService.sendEvent(resource, constEventosDb.DELETED, data, true);
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

            logging: true,  //Log to the Console

            //specify a non default root
            rootPath: baseUrlService.getBaseUrl() + "signalr",

            //stateChanged: function (state) {
            //  switch (state.newState) {
            //    case $.signalR.connectionState.connecting:
                  
            //      //your code here
            //      console.log(state.newState);
            //      break;
            //    case $.signalR.connectionState.connected:
            //      //your code here
            //      console.log(state.newState);
            //      break;
            //    case $.signalR.connectionState.reconnecting:
            //      //your code here
            //      console.log(state.newState);
            //      break;
            //    case $.signalR.connectionState.disconnected:
            //      //your code here
            //      console.log(state.newState);
            //      break;
            //  }
            //}
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
    

