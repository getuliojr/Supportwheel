(function () {

    'use strict';

    //Define o módulo
    angular.module('modules.topic.services.service.topic', [
        'modules.common.services.factory.appResource'
        ])
        .service('topicService', topicService);

    //Injeta dependencias
    topicService.$inject = ['appResourceFactory'];

    //Cria o serviço
    function topicService(appResourceFactory) {

        var service = appResourceFactory("topic", "intIdTopic");

        //Responsável pela validação dos dados no cliente
        service.validar = function (dados) {
            var erros = [];

            if (!dados.strTitle)
                erros.push("The title of the topic is required!");

            if (!dados.txtDescription)
                erros.push("The description of the topic is required!");

            return erros;
        };

        return service;
    }
})()