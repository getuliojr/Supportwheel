import angular from 'angular';
import appConstants from '../../app.constants.js';

MediatorService.$inject = ['appConstants', '$rootScope'];

class MediatorService {

    constructor(appConstants, $rootScope) {

        this.rootScope = $rootScope;
        this._eventListenQueue = [];

        //Adiciona um evento a fila para ser monitorado
        this._eventAdd = function(resource, type, callbackFunction, fromApp, fromHub) {
            let hashValue = hashFunction(callbackFunction);
            let listenItem = { resource: resource, type: type, hash: hashValue };

            //Listen from app
            if (!!fromApp) { 
                listenItem.fromApp = true;
            }
            //Listen form Hub
            if (!!fromHub) {
                listenItem.fromHub = true;
            }

            //Check if callback was not added before on the same resource, type and app or hub function
            let foundEventIndex = _.findIndex(this._eventListenQueue, listenItem);
            listenItem.callback = callbackFunction; //add callback

            if (foundEventIndex == -1) {    
                //Add new Subscriber ( it is not in the list yet)
                this._eventListenQueue.push(listenItem);
            } else {   
                //Update a existing one, sometimes because it was not removed on $destroy, it needs to be overwritten
                this._eventListenQueue[foundEventIndex] = listenItem;
            }

            //So it can be used with $destroy for example
            return unsubscribeEvent;

            //Return an Unsubscribe Event
            function unsubscribeEvent() {
                let indexItem = this._eventListenQueue.indexOf(listenItem);
                if (indexItem > -1) {
                    this._eventListenQueue.splice(indexItem, 1);
                }
            }


            //Helper Function to hash data
            function hashFunction(data) {
                let value = data.toString();
                let hash = 0;
                if (value.length == 0) return hash;
                for (var i = 0; i < value.length; i++) {
                    var char = value.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash; // Convert to 32bit integer
                }
                return hash;
            }
        }
    }

    //Escuta toda e qualquer mudança no recurso
    listenEventAll(resource, callbackFunction, fromApp, fromHub) {
        let eventInserted = listenEventInserted(resource, callbackFunction, fromApp, fromHub);
        let eventDeleted = listenEventDeleted(resource, callbackFunction, fromApp, fromHub);
        let eventUpdated = listenEventUpdated(resource, callbackFunction, fromApp, fromHub);
        return function () {
            eventInserted();
            eventDeleted();
            eventUpdated();
        }
    }

    //Escuta apenas mudanças de novos registros
    listenEventInserted(resource, callbackFunction, fromApp, fromHub) {
        return this._eventAdd(resource, appConstants.constEventosDB.inserted, callbackFunction, fromApp, fromHub);
    }

    //Escuta mudanças de atualizações de registros
    listenEventDeleted(resource, callbackFunction, fromApp, fromHub) {
        return this._eventAdd(resource, appConstants.constEventosDB.deleted, callbackFunction, fromApp, fromHub);
    }

    //Escuta mudançdas de exclusões de registros
    listenEventUpdated(resource, callbackFunction, fromApp, fromHub) {
        return this._eventAdd(resource, appConstants.constEventosDB.updated, callbackFunction, fromApp, fromHub);
    }
    
    //Dispara um evento para quem está escutando.
    sendEvent(resource, type, data, applyScope) {
        //Message to be broadcasted
        let broadcastMessage = { type: type, data: data, from: "app" };

        //When true it means it comes from the hub
        if (applyScope) {
            broadcastMessage.from = "hub";
        }

        //Call users who subscribed to event
        let lengthEvent = this._eventListenQueue.length;
        for (var e = 0; e < lengthEvent; e++) {
            if (this._eventListenQueue[e].resource == resource && this._eventListenQueue[e].type == type &&
                (!!applyScope && !!this._eventListenQueue[e].fromHub || !applyScope && !!this._eventListenQueue[e].fromApp)
            ) {
                this._eventListenQueue[e].callback(broadcastMessage);
            }
        }

        //Force an apply scope when it comes from hub, helpfull sometimes
        if (!!applyScope) {
            setTimeout(function () {
                this.rootScope.$apply();
            }, 4);
        }
    }
}

export default angular
    .module('app.shared.services.mediator', [])
    .service('mediatorService', MediatorService)
    .name;