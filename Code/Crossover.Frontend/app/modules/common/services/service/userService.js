(function () {

    'use strict';

    //Define o módulo
    angular.module('modules.common.services.service.user', [
        'modules.common.services.factory.appResource'
        ])
        .service('userService', topicService);

    //Injeta dependencias
    topicService.$inject = ['appResourceFactory'];

    //Cria o serviço
    function topicService(appResourceFactory) {

        var service = appResourceFactory("user", "intIdUser");

        //Responsável pela validação dos dados no cliente
        service.validar = function (dados) {
            var erros = [];

            if (!dados.strFullName)
                erros.push("The fullname is required!");

            if (!dados.strEmail)
                erros.push("The e-mail is required!");

            if (!dados.strPassword)
                erros.push("The password is required!");

            return erros;
        };

        return service;
    }
})()