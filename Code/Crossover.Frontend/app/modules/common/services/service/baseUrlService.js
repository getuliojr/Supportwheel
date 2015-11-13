(function () {

    'use strict';

    angular.module('modules.common.services.service.baseUrl', [
    ])

    .service('baseUrlService', baseUrlService);

    //Injeta dependencias
    baseUrlService.$inject = ['$location'];

    function baseUrlService($location) {

        //Api Pública
        this.getBaseUrl = getBaseUrl;

        //Funções
        //Retorna a url base, terminar com /, sempre.
        function getBaseUrl() {
            if ($location.absUrl().indexOf("http://localhost") != -1)
                return "http://localhost:9000/";
            else
                return "/";
        }
    }

})();