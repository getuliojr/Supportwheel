(function () {

    'use strict';

    //Define o módulo
    angular
        .module('modules.sample.services.newSample', [

        ])
        .service('newSampleService', sampleService);

    //Injeta dependencias
    sampleService.$inject = ['appResourceFactory'];

    //Cria o serviço
    function sampleService(appResourceFactory) {

        var service = appResourceFactory("newsamples", "sample_id");

        //Responsável pela validação dos dados no cliente
        service.validar = function (dados) {
            var erros = [];

            if (!dados.nome)
                erros.push("É necessário informar o nome do Sample.");

            if (!dados.telefone)
                erros.push("É necessário informar um telefone para o sample.");

            return erros;
        };

        return service;
    }
})()