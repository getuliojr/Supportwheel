(function () {

    'use strict';

    /**
     * @ngdoc service
     *
     * @name shared.services.factory.service:appResource
     *
     *
     * @description
     *
     * 
     *
     */
    angular.module('shared.services.factory.appResource', [
        'shared.services.service.baseUrl',
        'shared.services.value.constantes',
        'shared.services.service.mediator',
        'shared.services.service.hub'
    ])

    .factory('appResourceFactory', appResourceFactory);

    //Injeta dependencias
    appResourceFactory.$inject = ['$resource', '$q', '$rootScope', '$httpBackend', 'constEventosDb', 'baseUrlService', 'mediatorService', 'hubService'];

    function appResourceFactory($resource, $q, $rootScope, $httpBackend, constEventosDb, baseUrlService, mediatorService, hubService) {

        //Variáveis Privadas
        var _cache = {};
        var baseUrl = baseUrlService.getBaseUrl() + "api/";

        return function (recurso, surrogateKey) {

            //Definição das variaveis
            var service = {};
            var _hasHub = false;

            var webService = createResource(recurso);

            //Api Pública
            service.load = load;            //Carregar dados de um ou mais registros
            service.save = save;                //Insere ou Atualiza um registro com base na chave substituta (surrogateKey)
            service.remove = remove;              //Apaga um registro no recurso com base na chave substituta
            service.validate = validate;              //Responsável por validar o modelo, tem que ser incluida a parte o código
            service.clearCache = clearCache;      //Remove qualquer registro do cache
            service.listenEvent = listenEvent(recurso);  //When an item is added, updated or deleted this callback will be called
            service.createHub = createHub           //Create hub for real-time update
            return service;



            //Funções

            //Load New Data
            //Optional Accepted Params:
            //applyScope : true             //It will force an applyScope after the item has been loaded and processed
            //loadOne    : true             //It will force a request to return a single record, even if it has no surrogateKey
            //action     : value            //To instantiate a specific action in a resource
            function load(params) {
                var deferred = $q.defer();
                var queryParams = _parseParams(params);
                var applyScope;

                if (!!queryParams.applyScope) {
                    applyScope = true;
                    delete queryParams.applyScope;
                }
                if (surrogateKey == null || queryParams.hasOwnProperty(surrogateKey) || queryParams.hasOwnProperty("loadOne")) {
                    //Passou a chave primária, então carrega apenas um registro
                    queryParams.id = queryParams[surrogateKey];
                    delete queryParams[surrogateKey]; //apaga a chave, a mesma é passada por id
                    webService.get(queryParams).$promise.then(function (data) {
                        deferred.resolve(data);
                    }, function (err) {
                        deferred.reject(err);
                    });
                } else {
                    //Não foi passado a chave primária, então efetua uma busca por todos os parâmetros (Pesquisar)
                    webService.getAll(queryParams).then(function (data) {
                        deferred.resolve(data);
                    }, function (err) {
                        deferred.reject(err);
                    });
                }

                if (!!applyScope) {
                    deferred.promise.finally(function () {
                        setTimeout(function () {
                            $rootScope.$apply();
                        }, 4);
                    });
                }

                return deferred.promise;
            };

            //When you create a hub, the resource will get real-time notifications on every update, insert and delete
            function createHub() {
                _hasHub = true;
                hubService.subscribe(recurso);
            }

            //Save a record, if it has a surrogateKey it will send a PUT otherwise a POST
            function save(params, successCB, failedCB) {
                var deferred = $q.defer();
                var queryParams = _parseParams(params);

                if ((surrogateKey != null) && (queryParams.hasOwnProperty(surrogateKey))) {
                    var tipoEvento = constEventosDb.UPDATED; //Passou a chave primária, então está atualizando um registro
                } else {
                    var tipoEvento = constEventosDb.INSERTED; //Sem chave primária, novo registro
                }

                //Se possui código de validação
                if (this.validate != null) {
                    var erros = this.validate(queryParams); //Valida dados
                    if (erros.length > 0) {
                        deferred.reject({ type: 'warning', message: erros });
                        return deferred.promise;
                    }
                }

                //Se possui uma surrogateKey
                if (queryParams[surrogateKey]) {
                    //se tem ID, atualiza.
                    webService.update({ id: queryParams[surrogateKey] }, queryParams)
                        .$promise.then(function (data) {
                            mediatorService.sendEvent(recurso, tipoEvento, data, false);
                            deferred.resolve(data);
                        }, function (err) {
                            deferred.reject(err);
                        });
                } else {
                    //novo registro, insere
                    webService.save(null, queryParams)
                        .$promise.then(function (data) {
                            mediatorService.sendEvent(recurso, tipoEvento, data, false);
                            deferred.resolve(data);
                        }, function (err) {
                            deferred.reject(err);
                        });
                }

                return deferred.promise;
            };

            //Delete a record, it will send a DELETE
            function remove(params, successCB, failedCB) {
                var deferred = $q.defer();
                var queryParams = _parseParams(params);

                if (!queryParams.hasOwnProperty(surrogateKey)) {
                    deferred.reject({ type: 'warning', message: ["Não foi informado o ID do registro que se deseja excluir."] });
                } else {
                    webService.remove({ id: queryParams[surrogateKey] })
                    .$promise.then(function (data) {
                        mediatorService.sendEvent(recurso, constEventosDb.DELETED, data, false);
                        deferred.resolve(data);
                    }, function (err) {
                        deferred.reject(err);
                    });
                }
                return deferred.promise;
            };

            //Validate service on required fields
            function validate(dados) {
                var erros = [];
                return erros;
            };
            //Clear any cache an resource might have
            function clearCache() {
                return webService.clearCache();
            };

            //Listen for events comming from the own app or from the hubs
            function listenEvent(recurso) {
                return {
                    app : {
                        all: function (callback) { return mediatorService.listenEvent.all(recurso, callback, true, false); },
                        inserted: function (callback) { return mediatorService.listenEvent.inserted(recurso, callback, true, false); },
                        deleted: function (callback) { return mediatorService.listenEvent.deleted(recurso, callback, true, false); },
                        updated: function (callback) { return mediatorService.listenEvent.updated(recurso, callback, true, false); },
                    },
                    hub:  {
                        all: function (callback) { return mediatorService.listenEvent.all(recurso, callback, false, true); },
                        inserted: function (callback) { return mediatorService.listenEvent.inserted(recurso, callback, false, true); },
                        deleted: function (callback) { return mediatorService.listenEvent.deleted(recurso, callback, false, true); },
                        updated: function (callback) { return mediatorService.listenEvent.updated(recurso, callback, false, true); },
                    },
                    both: {
                        all: function (callback) { return mediatorService.listenEvent.all(recurso, callback, true, true); },
                        inserted: function (callback) { return mediatorService.listenEvent.inserted(recurso, callback, true, true); },
                        deleted: function (callback) { return mediatorService.listenEvent.deleted(recurso, callback, true, true); },
                        updated: function (callback) { return mediatorService.listenEvent.updated(recurso, callback, true, true); },
                    }
                    
                };

            }

            //***************************
            // Funções auxiliares
            //***************************

            function createResource(recurso) {

                //$resource(url[, paramDefaults][, actions]);
                //{action1: {method:?, params:?, isArray:?},
                //- `action` – {string} – The name of action. This name becomes the name of the method on your resource object.
                //- `method` – {string} – HTTP request method. Valid methods are: `GET`, `POST`, `PUT`, `DELETE`, and `JSONP`
                //- `params` – {object=} – Optional set of pre-bound parameters for this action.
                //- isArray – {boolean=} – If true then the returned object for this action is an array
                var resource = $resource(baseUrl + recurso + '/:action/:id',
                        {}, {
                            update: { method: 'PUT', params: { id: '@id' } }
                              , save: { method: 'POST' }
                              , remove: { method: 'DELETE', params: { id: '@id' } }
                              , get: { method: 'GET', params: { id: '@id' } }
                              , query: { method: 'GET', isArray: true }
                        });

                //Responsavel por limpar o cache do recurso em questao
                resource.clearCache = function () {
                    var key = 'api/' + recurso;
                    for (var c in _cache) {
                        if (c.indexOf(key) > -1)
                            delete _cache[c];
                    }
                }

                //Retorna um Array com DADOS, opção para manter em cache
                resource.getAll = function (params) {

                    var deferred = $q.defer(); //Cria uma promessa

                    //Se solicitou que seja feito um cache, chama o método para resolver o mesmo
                    if (params && params["cache"] !== undefined && params["cache"] === true) {
                        var key = 'api/' + recurso;

                        //Se algum outro parâmetro fora o cache foi passado, reconstroi a chamada
                        for (var p in params) {
                            if (Object.prototype.toString.call(params[p]) === '[object Array]') {
                                //Transforma arrays em strings com virgula
                                var fixedCollection = "";
                                for (var arvalue = 0; arvalue < params[p].length; arvalue++) {
                                    if (arvalue > 0)
                                        fixedCollection += ",";
                                    fixedCollection += params[p][arvalue];
                                }
                                params[p] = fixedCollection;
                            }
                            if (p !== "cache") {
                                key += "&" + p + "=" + params[p];
                            }
                        }

                        if (_cache[key]) { //Se existe em cache, retorna o resultado
                            deferred.resolve(_cache[key]);
                            return deferred.promise;
                        }
                    }

                    //Se chegou aqui não está em cache, busca os dados
                    resource.query(params).$promise.then(function (result) {
                        if (key) {
                            _cache[key] = result; //Salva em cache
                        }
                        deferred.resolve(result); //Envia para o usuario
                    }, function (err) {
                        deferred.reject(err);
                    });

                    
                    //Retorna promessa
                    return deferred.promise;
                }

                return resource;
            }

            //Remove all undefined, null, empty values and functions
            //parse data do be in ISO format
            function _parseParams(params) {
                var parsedParams = {}
                for (var i in params) {
                    if ((params[i] !== undefined) && (params[i] !== "") && (typeof (params[i]) != 'function')) {
                        if (angular.isDate(params[i])) {
                            parsedParams[i] = new Date(params[i] - (params[i].getTimezoneOffset() * 60 * 1000)).toISOString();
                        } else {
                            parsedParams[i] = params[i];
                        }
                    }
                }

                delete parsedParams.viewInfo; //Informações de ViewState
                return parsedParams;

            }

        }

    }

})();
    

