(function () {

    'use strict';

    //Define o módulo
    angular.module('modules.comment.services.service.comment', [
        'modules.common.services.factory.appResource'
        ])
        .service('commentService', commentService);

    //Injeta dependencias
    commentService.$inject = ['appResourceFactory'];

    //Cria o serviço
    function commentService(appResourceFactory) {

        var service = appResourceFactory("comment", "intIdComment");

        //Responsável pela validação dos dados no cliente
        service.validar = function (dados) {
            var erros = [];

            if (!dados.txtDescription)
                erros.push("The reply message is required!");

            return erros;
        };

        return service;
    }
})()