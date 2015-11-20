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
                throw "It is required to inform the name of the resource in the server.";
            }
            
            //Private: Mantem os dados
            var _serviceData = {};
            var _lastAnswer = undefined;
            var _lastServerStatus = undefined

            //API Pública
            var service = {};
            service.getData = getData;
            service.lastServerAnswer = lastServerAnswer;
            service.lastServerStatus = lastServerStatus;

            //Inicializa o serviço
            init();

            //Funções
            function getData(filter) {
                if (filter == undefined) {
                    return _serviceData;
                } else {
                    return _.find(_serviceData, filter);
                }
            };

            function lastServerAnswer() {
                return _lastAnswer;
            };

            function lastServerStatus() {
                return _lastServerStatus;
            }
            function init() {
                //var mockUrl = new RegExp('^http\:\/\/.+?\/' + resourceName + '$');
                //var mockUrlWithId = new RegExp('^http\:\/\/.+?\/' + resourceName + '\/(.+)$');
                var mockUrl = "/api/" + resourceName; 
                var mockUrlWithId = RegExp('/api/' + resourceName + '\/(.+)$'); 

                if (seedData) {
                    _serviceData = seedData;
                }

                //Get ALL
                $httpBackend.whenGET(mockUrl).respond(function () {
                    _lastAnswer = _serviceData;
                    _lastServerStatus = 200;
                    return [200, _serviceData, {}];
                });
                    
                

                //Get ONE
                $httpBackend.whenGET(mockUrlWithId).respond(function(method, url, data, headers) {
                    var regexp = new RegExp('\\/' + resourceName + '\\/([0-9]+)');
                    var mockId = url.match(regexp)[1];
                    var params = {};
                    params[surrogateKey] = +mockId;
                    var item = _.find(_serviceData, params);
                    if (item) {
                        _lastAnswer = item;
                        _lastServerStatus = 200;
                        return [200, item, {}];
                    } else {
                        _lastAnswer = "";
                        _lastServerStatus = 404;
                        return [404, {}, {}];
                    }
                });

                //POST
                $httpBackend.whenPOST(mockUrl).respond(function(method, url, data, headers) {
                    //converte de string para json
                    data = angular.fromJson(data);
                    //gera um Id de 1000 a 99999
                    data[surrogateKey] = Math.floor(Math.random() * 99999 + 1000);
                    //adiciona na lista atual
                    _serviceData.push(data);
                    //retorna o registro inserido com um fakeID
                    _lastAnswer = data;
                    _lastServerStatus = 201;
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
                        _lastAnswer = data;
                        _lastServerStatus = 200;
                        return [200, data, {}];
                    } else {
                        _lastAnswer = "";
                        _lastServerStatus = 404;
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
                        _lastAnswer = deletedItem[0];
                        _lastServerStatus = 200;
                        return [200, deletedItem[0], {}];
                    } else {
                        _lastAnswer = "";
                        _lastServerStatus = 404;
                        return [404, {}, {}];
                    }
                });
            }

            return service;
        }
    }
})();