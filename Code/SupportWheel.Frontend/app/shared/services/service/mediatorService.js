(function () {

    'use strict';

    angular.module('shared.services.service.mediator', [
        'shared.services.value.constantes'
    ])

    .service('mediatorService', mediatorService);

    //Injeta dependencias
    mediatorService.$inject = ['constEventosDb', '$rootScope'];

    function mediatorService (constEventosDb, $rootScope) {

        //Variaveis privadas
        var _eventListenQueue = [];
        
        //Api Publica
        this.sendEvent =  sendEvent;
        this.listenEvent =  {
            all: listenEventAll,
            inserted: listenEventInserted,
            deleted: listenEventDeleted,
            updated: listenEventUpdated
        };

        //Funções
        function listenEventAll(resource, callbackFunction, fromApp, fromHub){
            var eventInserted = listenEventInserted(resource, callbackFunction, fromApp, fromHub);
            var eventDeleted = listenEventDeleted(resource, callbackFunction, fromApp, fromHub);
            var eventUpdated = listenEventUpdated(resource, callbackFunction, fromApp, fromHub);
            return function () {
                eventInserted();
                eventDeleted();
                eventUpdated();
            }
        }
        function listenEventInserted(resource, callbackFunction, fromApp, fromHub){
            return _listenEventAdd(resource, constEventosDb.INSERTED, callbackFunction, fromApp, fromHub);
        }
        function listenEventDeleted(resource, callbackFunction, fromApp, fromHub){
            return _listenEventAdd(resource, constEventosDb.DELETED, callbackFunction, fromApp, fromHub);
        }
        function listenEventUpdated(resource, callbackFunction, fromApp, fromHub){
            return _listenEventAdd(resource, constEventosDb.UPDATED, callbackFunction, fromApp, fromHub);
        }
        function _listenEventAdd(resource, type, callbackFunction, fromApp, fromHub) {
            var hashValue = hashFunction(callbackFunction);
            var listenItem = { resource: resource, type: type, hash: hashValue };
            
            if (!!fromApp) { //Listen from app
                listenItem.fromApp = true;
            }
            if (!!fromHub) {
                listenItem.fromHub = true;
            }

            //Check if callback was not added before on the same resource, type and app or hub function
            var foundEventIndex = _.findIndex(_eventListenQueue, listenItem);
            listenItem.callback = callbackFunction; //add callback

            if (foundEventIndex == -1) {    //Add new Subscriber ( it is not in the list yet)
                _eventListenQueue.push(listenItem);
            } else {   //Update a existing one, sometimes because it was not removed on $destroy, it needs to be overwritten
                _eventListenQueue[foundEventIndex] = listenItem;
            }

            //So it can be used with $destroy for example
            return unsubscribeEvent;

            //Return an Unsubscribe Event
            function unsubscribeEvent () {
                var indexItem = _eventListenQueue.indexOf(listenItem);
                if (indexItem > -1) {
                    _eventListenQueue.splice(indexItem, 1);
                }
             }


            //Helper Function
            function hashFunction(data) {
                var value = data.toString();
                var hash = 0;
                if (value.length == 0) return hash;
                for (var i = 0; i < value.length; i++) {
                    var char = value.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash; // Convert to 32bit integer
                }
                return hash;
            }
        };
        
        function sendEvent(resource, type, data, applyScope) {
            //Message to be broadcasted
            var broadcastMessage = { type: type, data: data, from: "app" };

            //When true it means it comes from the hub
            if (applyScope) {
                broadcastMessage.from = "hub";
            }
  
            //Call users who subscribed to event
            var lengthEvent = _eventListenQueue.length;
            for (var e = 0; e < lengthEvent; e++) {
                if (_eventListenQueue[e].resource == resource && _eventListenQueue[e].type == type && 
                    (!!applyScope && !!_eventListenQueue[e].fromHub || !applyScope && !!_eventListenQueue[e].fromApp)
                   ) {
                    _eventListenQueue[e].callback(broadcastMessage);
                }
            }

            //Force an apply scope when it comes from hub, helpfull sometimes
            if (!!applyScope) {
                setTimeout(function () {
                    $rootScope.$apply();
                }, 4);
            }
        }
    }
})();
