(function () {

    'use strict';

    angular.module('modules.common.services.factory.hubResource', [
        'modules.common.services.value.constantes'
    ])

    .factory('hubResourceFactory', hubResourceFactory);

    //Injeta dependencias
    hubResourceFactory.$inject = ['$rootScope', 'constEventosDb', 'Hub'];

    function hubResourceFactory($rootScope, constEventosDb, Hub) {

        return function (recurso) {

            var hub = new Hub(recurso, {

                //client side methods
                listeners: {
                    'inserted':function(data){
                        console.log("hub-inserted" + data);
                    },
                    'updated':function(data){
                        console.log("hub-updated" + data);
                    },
                    'deleted': function (data) {
                        console.log("hub-deleted" + data)

                    }
                },

                //server side methods
                methods: ['subscribe', 'unsubscribe'],

                //query params sent on initial connection
                queryParams: {
                    'token': 'exampletoken'
                },

                //handle connection error
                errorHandler: function (error) {
                    console.log(error);
                },

                //specify a non default root
                rootPath: 'http://localhost:9000/signalr',

                stateChanged: function (state) {
                    switch (state.newState) {
                        case $.signalR.connectionState.connecting:
                            //your code here
                            break;
                        case $.signalR.connectionState.connected:
                            //your code here
                            break;
                        case $.signalR.connectionState.reconnecting:
                            //your code here
                            break;
                        case $.signalR.connectionState.disconnected:
                            //your code here
                            break;
                    }
                }
            });

            return {
                subscribe: subscribe,
                unsubscribe: unsubscribe
            };


            //Helper Function
            function subscribe() {
                hub.subscribe(recurso); //Calling a server method
            };

            function unsubscribe() {
                hub.unsubscribe(recurso); //Calling a server method
            }

        }

    }

})();
    

