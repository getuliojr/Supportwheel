(function() {

    'use strict';

    angular.module('modules.common.services.factory.mockHttp', [
    ])

    .factory('MockHttpFactory', MockHttpFactory);

    //Injeta dependencias
    MockHttpFactory.$inject = ['$httpBackend'];

    function MockHttpFactory($httpBackend) {

        return function (resourceName, surrogateKey, seedData) {

            //Parâmetros obrigatórios
            if (resourceName == undefined) {
                throw "É obrigatório informar o nome do recurso no servidor.";
            }

            //Private: Mantem os dados
            var _serviceData = {};

            //API Pública
            var service = {};
            service.getData = getData;

            //Inicializa o serviço
            init();

            //Funções
            function getData() {
                return _serviceData;
            };

            function init() {
                var mockUrl = new RegExp('^http\:\/\/.+?\/' + resourceName + '$');
                var mockUrlWithId = new RegExp('^http\:\/\/.+?\/' + resourceName + '\/(.+)$');

                if (seedData) {
                    _serviceData = seedData;
                }

                //Get ALL
                $httpBackend.whenGET(mockUrl).respond(200, _serviceData);

                //Get ONE
                $httpBackend.whenGET(mockUrlWithId).respond(function(method, url, data, headers) {
                    var regexp = new RegExp('\\/' + resourceName + '\\/([0-9]+)');
                    var mockId = url.match(regexp)[1];
                    var params = {};
                    params[surrogateKey] = +mockId;
                    var item = _.find(_serviceData, params);
                    if (item) {
                        return [200, item, {}];
                    } else {
                        return [404, {}, {}];
                    }
                });

                //POST
                $httpBackend.whenPOST(mockUrl).respond(function(method, url, data, headers) {
                    //converte de string para json
                    data = angular.fromJson(data);
                    //gera um Id de 1000 a 99999
                    data.id = Math.floor(Math.random() * 99999 + 1000);
                    //adiciona na lista atual
                    _serviceData.push(data);
                    //retorna o registro inserido com um fakeID
                    return [201, data, {}];
                });

                //PUT
                $httpBackend.whenPUT(mockUrlWithId).respond(function(method, url, data, headers) {
                    //converte de string para json
                    data = angular.fromJson(data);
                    var regexp = new RegExp('\\/' + resourceName + '\\/([0-9]+)');
                    var mockId = url.match(regexp)[1];
                    var params = {};
                    params[surrogateKey] = +mockId;
                    var item = _.find(_serviceData, params);
                    if (item) {
                        angular.extend(_serviceData[_serviceData.indexOf(item)], data);
                        return [200, data, {}];
                    } else {
                        return [404, {}, {}];
                    }
                });


                //DELETE
                $httpBackend.whenDELETE(mockUrlWithId).respond(function(method, url, data, headers) {
                    var regexp = new RegExp('\\/' + resourceName + '\\/([0-9]+)');
                    var mockId = url.match(regexp)[1];
                    var params = {};
                    params[surrogateKey] = +mockId;
                    var item = _.find(_serviceData, params);
                    if (item) {
                        var deletedItem = _serviceData.splice(_serviceData.indexOf(item), 1);
                        return [200, deletedItem[0], {}];
                    } else {
                        return [404, {}, {}];
                    }
                });
            }

            return service;
        }
    }
})();