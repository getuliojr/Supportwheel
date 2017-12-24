(function () {

  'use strict';

  //Define o módulo
  angular.module('shared.services.service.user', [
    'shared.services.factory.appResource'
  ])

    /**
* @ngdoc service
* @name shared.services.service.service:user
* @description
*
* This service is responsible to get information about the users in the system
*
*/
    .service('userService', userService);

  //Injeta dependencias
  userService.$inject = ['appResourceFactory'];

  //Cria o serviço
  function userService(appResourceFactory) {

    var service = appResourceFactory("user", "intIdUser");

    //Responsável pela validação dos dados no cliente
    service.validar = function (dados) {
      var erros = [];

      if (!dados.strFullName)
        erros.push("The name is required!");

      if (!dados.strEmail)
        erros.push("The e-mail is required!");

      if (!dados.strPassword)
        erros.push("The password is required!");

      return erros;
    };

    return service;
  }
})();
