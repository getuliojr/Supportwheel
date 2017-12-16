(function () {

    'use strict';

    //Define o módulo
    angular.module('shared.services.service.usuario', [
        'shared.services.factory.appResource'
        ])
        .service('usuarioService', usuarioService);

    //Injeta dependencias
    usuarioService.$inject = ['appResourceFactory'];

    //Cria o serviço
    function usuarioService(appResourceFactory) {

        var service = appResourceFactory("user", "intIdUser");

        //Responsável pela validação dos dados no cliente
        service.validar = function (dados) {
            var erros = [];

            if (!dados.strNomeUsuario)
                erros.push("O campo nome é obrigatório!");

            if (!dados.strEmail)
                erros.push("O campo e-mail é obrigatório!");

            if (!dados.strSenha)
                erros.push("O campos senha é obrigatório!");

            if (!dados.intIdInstituicao)
                erros.push("A instituição do usuário é obrigatória!");

            return erros;
        };

        return service;
    }
})()
