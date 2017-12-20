(function () {

    'use strict';

    //Define o módulo
    angular.module('shared.services.service.engineer', [
        'shared.services.factory.appResource'
        ])
        .service('engineerService', engineerService);

    //Injeta dependencias
    engineerService.$inject = ['appResourceFactory'];

    //Cria o serviço
    function engineerService(appResourceFactory) {

      var service = appResourceFactory("engineer", "intIdEngineer");

        //Tell the service to listen for websocket connection
        service.createHub();

        //Responsável pela validação dos dados no cliente
        service.validar = function (dados) {
            var erros = [];

            if (!dados.strNameEngineer)
                erros.push("O campo nome é obrigatório!");

            return erros;
        };

        return service;
    }
})()
