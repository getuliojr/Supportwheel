(function () {

    'use strict';

    angular.module('modules.common.services.service.excecao', [
        'modules.common.services.service.notification'
    ])

    .service('excecaoService', excecaoService);

    //Injeta dependencias
    excecaoService.$inject = ['notificationService'];

    function excecaoService(notificationService) {

        //Api Pública
        this.tratarErro = tratarErro;
        
        //Funções
        function tratarErro(exception) {
            var type = exception.type || 'error'; //pode ser 'warning', padrão é error;
            var msg = "<strong>Ocorreu um erro no sistema ainda não identificado, entre em contato com a informática para auxiliar na solução do problema.</strong>"; //Mensagem Padrão

            if (exception.status == 0) {
                msg = "<strong>Não foi encontrada uma conexão com a internet e por isso não é possível carregar as informações. Tente mais tarde ou verifique sua conexão.</strong>";
            } else if (exception.status == 404) {
                //Mensagem é gerada no servidor, pelas APis,
                if (exception.data) {
                    msg = exception.data;
                } else {
                    msg = "<strong>O recurso não foi encontrado no servidor.</strong>";
                }
            } else if (exception.status == 400) {
                //normalmente erros de validação de modelo
                if (exception.data.Message)
                    msg = exception.data.Message;
                else
                    msg = exception.data;

                if (exception.data.ModelState) {
                    for (var item in exception.data.ModelState) {
                        msg += "</br>" + exception.data.ModelState[item];
                    }
                }

            } else if (exception.status == 500) {
                msg = exception.data;
            } else if (exception.message) {
                //mensagem de erro personalizadas que podem ser enviadas via aplicação
                msg = exception.message;
            } else if (exception.ModelState) {
                msg = "";
                var erro;
                for (erro in exception.ModelState) {
                    msg += exception.ModelState[erro] + "<br />";
                }
            }

            notificationService.notificar(type, msg);
        }
    }
})();
