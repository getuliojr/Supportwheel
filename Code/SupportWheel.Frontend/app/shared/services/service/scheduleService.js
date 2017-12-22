(function () {

    'use strict';

    //Define o módulo
    angular.module('shared.services.service.schedule', [
        'shared.services.factory.appResource'
    ])

          /**
     * @ngdoc service
     * @name shared.services.service.service:schedule
     * @description
     *
     * This service is responsible to get information about the schedule in the system
     *
     */
        .service('scheduleService', scheduleService);

    //Injeta dependencias
    scheduleService.$inject = ['appResourceFactory'];

    //Cria o serviço
    function scheduleService(appResourceFactory) {

      var service = appResourceFactory("schedule", "intIdSchedule");

      //Tell the service to listen for websocket connection
      service.createHub();

        //Responsável pela validação dos dados no cliente
        service.validar = function (dados) {
            var erros = [];

            if (!dados.dteSchedule)
                erros.push("The date of the draft is required!");

            if (!dados.intPeriod)
                erros.push("The period of the shift to draft is required!");

            return erros;
        };

        return service;
    }
})()
