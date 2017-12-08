import angular from 'angular';
import webApiService from './webApi.service.js';

UsuarioService.$inject = [webApiService];

class UsuarioService {

    constructor(webApiService) {
        let that = this;
        that = new webApiService("usuario", "idUsuario")

    }

    validate (dados) {
        let erros = [];

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
}

export default angular
    .module('app.shared.services.usuario', [])
    .service('usuarioService', UsuarioService)
    .name;