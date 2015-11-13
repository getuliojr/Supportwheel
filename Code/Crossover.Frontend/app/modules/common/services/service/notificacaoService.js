(function () {

    'use strict';

    angular.module('modules.common.services.service.notificacao', [])
    .service('notificacaoService', notificacaoService);


    function notificacaoService() {

        //Api Pública
        this.show = show;
        
        //Funções
        function show (tipo, mensagens, layout) {
            var bufferMsg = '';

            if (angular.isObject(mensagens)) {
                for (var mensagem in mensagens) {
                    if (angular.isArray(mensagens[mensagem])) {
                        for (var i = 0; i < mensagens[mensagem].length; i++) {
                            if (mensagens[mensagem][i] != '') {
                                bufferMsg += '<span>' + mensagens[mensagem][i] + '</span><br/>';
                            }
                        }
                    } else {
                        if (mensagens[mensagem] != '') {
                            bufferMsg += '<span>' + mensagens[mensagem] + '</span><br/>';
                        }
                    }
                }
            } else {
                bufferMsg = mensagens;
            }

            //Configura o Toaster para exibir as mensagens
            toastr[tipo](bufferMsg);
            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": true,
                "progressBar": true,
                "positionClass": "toast-top-right",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "15000",
                "extendedTimeOut": "2000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }
        }
    }

})();