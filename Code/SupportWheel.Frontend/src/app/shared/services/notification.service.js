import angular from 'angular';
import angularTranslate from 'angular-translate';
import toastr from 'toastr';

NotificationService.$inject = ['$translate'];

class NotificationService {

    constructor($translate, toaster) {
        this.translate = $translate;
    }

    show(tipo, mensagens) {
        let bufferMsg = '';

        if (angular.isObject(mensagens)) {
            for (var mensagem in mensagens) {
                if (angular.isArray(mensagens[mensagem])) {
                    for (var i = 0; i < mensagens[mensagem].length; i++) {
                        if (mensagens[mensagem][i] != '') {
                            bufferMsg += '<span>' + this.translate.instant(mensagens[mensagem][i]) + '</span><br/>';
                        }
                    }
                } else {
                    if (mensagens[mensagem] != '') {
                        bufferMsg += '<span>' + this.translate.instant(mensagens[mensagem]) + '</span><br/>';
                    }
                }
            }
        } else {
            bufferMsg = this.translate.instant(mensagens);
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
    
}

export default angular
    .module('app.shared.services.notification', [])
    .service('notificationService', NotificationService)
    .name;