(function () {

    'use strict';

    angular.module('modules.common.services.factory.handleException', [
        'modules.common.services.service.notification'
    ])

    .service('handleExceptionFactory', handleExceptionFactory);

    //Injeta dependencias
    handleExceptionFactory.$inject = ['notificationService'];

    function handleExceptionFactory(notificationService) {

        return function (exception) {
            var type = exception.type || 'error'; //it can be 'warning' or 'error', defaults to 'error'

            var msg = "<strong>An unidentified error has occurred. Please contact support for help.</strong>"; //Mensagem Padrão

            if (exception.status == 0) {
                //No Connection Exception
                msg = "<strong>No internet connection was found or the server is down. Verify your connection and try again.</strong>";
            } else if (exception.status == 400) {
                //Validation Model Exception
                if (exception.data.message)
                    msg = "<strong>" + exception.data.message + "</strong>";
                else
                    msg = "<strong>" + exception.data + "</strong>";

                if (exception.data.modelState) {
                    for (var item in exception.data.modelState) {
                        msg += "<br />" + exception.data.modelState[item];
                    }
                }

            } else if (exception.status == 401) {
                //General Exception
                type = "warning";
                msg = "You have not provided the required permission to view this resource.";
            } else if (exception.status == 404) {
                //Not Found Exception
                if (exception.data) {
                    msg = exception.data;
                } else {
                    msg = "<strong>The resource you are looking for was not found in the server.</strong>";
                }
            }  else if (exception.status == 500) {
                //General Exception
                msg = exception.data.replace(/(?:\r\n|\r|\n)/g, '<br /><br />');
            } else if (exception.message) {
                //Custom messages sent by the API on the server
                msg = exception.message;
            } else if (exception.modelState) {
                msg = "";
                var erro;
                for (erro in exception.modelState) {
                    msg += exception.modelState[erro] + "<br />";
                }
            }

            notificationService.show(type, msg);
        }
    }
})();
