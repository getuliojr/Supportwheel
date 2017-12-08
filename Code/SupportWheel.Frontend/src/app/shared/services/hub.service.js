import angular from 'angular';
import appConstants from '../../app.constants.js';
import mediatorService from './mediator.service.js';

HubService.$inject = ['Hub', 'mediatorService', 'appConstants', 'baseUrlService'];

class HubService {
    
    constructor(Hub,mediatorService, appConstants, baseUrlService) {
        this.hub = new Hub("ApiHub", {

            //client side methods
            listeners: {
                'inserted': function (resource, data) {
                    mediatorService.sendEvent(resource, appConstants.constEventosDb.INSERTED, data, true);
                },
                'updated': function (resource, data) {
                    mediatorService.sendEvent(resource, appConstants.constEventosDb.UPDATED, data, true);
                },
                'deleted': function (resource, data) {
                    mediatorService.sendEvent(resource, appConstants.constEventosDb.DELETED, data, true);
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

            //Log to the Console
            logging: false,  

            //specify a non default root
            rootPath: baseUrlService.getBaseUrl() + "signalr"

        });
    }

    getConnectionId() {
        return hub.connection.id;
    }

    subscribe(recurso) {
        hub.promise.then(function () {
            //Subscribe in the server
            hub.subscribe(recurso);     
        })
    }

    unsubscribe(recurso) {
        //Calling a server method
        hub.unsubscribe(recurso); 
    }
}

export default angular
    .module('app.shared.services.hub', [])
    .service('hubService', HubService)
    .name;