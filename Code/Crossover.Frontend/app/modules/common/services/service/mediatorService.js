(function () {

    'use strict';

    angular.module('modules.common.services.service.mediator', [
        'modules.common.services.value.constantes'
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
            removed: listenEventRemoved,
            updated: listenEventUpdated
        };

        //Funções
        function listenEventAll(resource, callbackFunction){
            var eventInserted = listenEventInserted(resource, callbackFunction);
            var eventRemoved = listenEventRemoved(resource, callbackFunction);
            var eventUpdated = listenEventUpdated(resource, callbackFunction);
            return function () {
                eventInserted();
                eventRemoved();
                eventUpdated();
            }
        }
        function listenEventInserted(resource, callbackFunction){
            return _listenEventAdd(resource, constEventosDb.INSERIDO, callbackFunction);
        }
        function listenEventRemoved(resource, callbackFunction){
            return _listenEventAdd(resource, constEventosDb.REMOVIDO, callbackFunction);
        }
        function listenEventUpdated(resource, callbackFunction){
            return _listenEventAdd(resource, constEventosDb.ATUALIZADO, callbackFunction);
        }
        function _listenEventAdd(resource, type, callbackFunction) {
            var hashValue = hashFunction(callbackFunction);
            var listenItem = { resource: resource, type: type, callback: callbackFunction, hash: hashValue };

            //Check if callback was not added before on the listen event type
            var foundEventIndex = _.findIndex(_eventListenQueue, { resource: resource, type: type, hash: hashValue });

            if (foundEventIndex == -1) {    //Add new Subscriber
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
            var broadcastMessage = { type: type, data: data };

            if (applyScope) {
                broadcastMessage.needScopeApply = true
            }

            //Call users who subscribed to event
            var lengthEvent = _eventListenQueue.length;
            for (var e = 0; e < lengthEvent; e++) {
                if (_eventListenQueue[e].resource == resource && _eventListenQueue[e].type == type) {
                    _eventListenQueue[e].callback(broadcastMessage);
                }
            }

            //Apply scope when it comes from hub, helpfull sometimes
            if (!!applyScope) {
                setTimeout(function () {
                    $rootScope.$apply();
                }, 4);
            }
        }
    }
})();