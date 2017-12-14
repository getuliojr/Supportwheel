(function () {

    'use strict';

    angular.module('shared.services.service.notification', [

    ])
    .service('notificationService', notificationService);

    notificationService.$inject = ['$translate'];

    function notificationService($translate) {

        //Api Pública
        this.show = show;

        //Funções
        function show(tipo, mensagens) {
            var bufferMsg = '';

            if (angular.isObject(mensagens)) {
                for (var mensagem in mensagens) {
                    if (angular.isArray(mensagens[mensagem])) {
                        for (var i = 0; i < mensagens[mensagem].length; i++) {
                            if (mensagens[mensagem][i] != '') {
                                bufferMsg += '<span>' + tranlateMessage(mensagens[mensagem][i]) + '</span><br/>';
                            }
                        }
                    } else {
                        if (mensagens[mensagem] != '') {
                            bufferMsg += '<span>' + tranlateMessage(mensagens[mensagem]) + '</span><br/>';
                        }
                    }
                }
            } else {
                bufferMsg = tranlateMessage(mensagens);
            }

            //Configura o Toaster para exibir as mensagens
            toastr[tipo](bufferMsg);
            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": true,
                "progressBar": true,
                "positionClass": "toast-bottom-right",
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

        //Responsible to translate message if needed
        function tranlateMessage(message){
            return $translate.instant(message);
        }
    }

})();