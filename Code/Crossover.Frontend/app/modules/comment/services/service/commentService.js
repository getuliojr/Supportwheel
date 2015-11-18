(function () {

    'use strict';

    //Define o módulo
    angular.module('modules.comment.services.service.comment', [
        'modules.common.services.factory.appResource',
        'modules.common.services.factory.hubResource'
        ])
        .service('commentService', commentService);

    //Injeta dependencias
    commentService.$inject = ['appResourceFactory','hubResourceFactory'];

    //Cria o serviço
    function commentService(appResourceFactory, hubResourceFactory) {

        var service = appResourceFactory("comment", "intIdComment");
        service.hub = hubResourceFactory("comment");
        service.hub.subscribe("comment");

        //Responsável pela validação dos dados no cliente
        service.validar = function (dados) {
            var erros = [];

            if (!dados.intIdTopic)
                erros.push("The id of the topic is required!");

            if (!dados.txtComment)
                erros.push("The reply message is required!");

            return erros;
        };

        return service;
    }
})()