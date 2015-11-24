(function () {

    'use strict';

    angular.module('modules.common.services.factory.appResource', [
        'modules.common.services.service.baseUrl',
        'modules.common.services.value.constantes',
        'modules.common.services.service.mediator',
        'modules.common.services.service.hub'
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
            service.carregar = carregar;            //Carregar dados de um ou mais registros
            service.salvar = salvar;                //Insere ou Atualiza um registro com base na chave substituta (surrogateKey)
            service.remover = remover;              //Apaga um registro no recurso com base na chave substituta
            service.validar = validar;              //Responsável por validar o modelo, tem que ser incluida a parte o código
            service.limparCache = limparCache;      //Remove qualquer registro do cache
            service.listenEvent = listenEvent(recurso);  //When an item is added, updated or deleted this callback will be called
            service.createHub = createHub           //Create hub for real-time update
            return service;



            //Funções
            function carregar(params) {
                var deferred = $q.defer();
                var queryParams = _parseParams(params);

                if ((surrogateKey == null) || (queryParams.hasOwnProperty(surrogateKey))) {
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

                return deferred.promise;
            };
            function createHub() {
                _hasHub = true;
                hubService.subscribe(recurso);
            }
            function salvar(params, successCB, failedCB) {
                var deferred = $q.defer();
                var queryParams = _parseParams(params);

                if ((surrogateKey != null) && (queryParams.hasOwnProperty(surrogateKey))) {
                    var tipoEvento = constEventosDb.ATUALIZADO; //Passou a chave primária, então está atualizando um registro
                } else {
                    var tipoEvento = constEventosDb.INSERIDO; //Sem chave primária, novo registro
                }

                //Se possui código de validação
                if (this.validar != null) {
                    var errosValidacao = this.validar(queryParams); //Valida dados
                    if (errosValidacao.length > 0) {
                        deferred.reject({ type: 'warning', message: errosValidacao });
                        return deferred.promise;
                    }
                }

                //Se possui uma surrogateKey
                if (queryParams[surrogateKey]) {
                    //se tem ID, atualiza.
                    webService.update({ id: queryParams[surrogateKey] }, queryParams)
                        .$promise.then(function (data) {
                            if (!_hasHub) {
                                mediatorService.sendEvent(recurso, tipoEvento, data, false);
                            }
                            deferred.resolve(data);
                        }, function (err) {
                            deferred.reject(err);
                        });
                } else {
                    //novo registro, insere
                    webService.save(null, queryParams)
                        .$promise.then(function (data) {
                            if (!_hasHub) {
                                mediatorService.sendEvent(recurso, tipoEvento, data, false);
                            }
                            deferred.resolve(data);
                        }, function (err) {
                            deferred.reject(err);
                        });
                }

                return deferred.promise;
            };
            function remover(params, successCB, failedCB) {
                var deferred = $q.defer();
                var queryParams = _parseParams(params);

                if (!queryParams.hasOwnProperty(surrogateKey)) {
                    deferred.reject({ type: 'warning', message: ["Não foi informado o ID do registro que se deseja excluir."] });
                } else {
                    webService.remove({ id: queryParams[surrogateKey] })
                    .$promise.then(function (data) {
                        if (_hasHub) {
                            mediatorService.sendEvent(recurso, constEventosDb.REMOVIDO, data, false);
                        }
                        deferred.resolve(data);
                    }, function (err) {
                        deferred.reject(err);
                    });
                }
                return deferred.promise;
            };
            function validar(dados) {
                var erros = [];
                return erros;
            };
            function limparCache() {
                return webService.clearCache();
            };
            function listenEvent(recurso) {
                return {
                    all: function (callback) { mediatorService.listenEvent.all(recurso, callback); },
                    inserted: function (callback) { mediatorService.listenEvent.inserted(recurso, callback); },
                    removed: function (callback) { mediatorService.listenEvent.removed(recurso, callback); },
                    updated: function (callback) { mediatorService.listenEvent.updated(recurso, callback); },
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
                var resource = $resource(baseUrl + recurso + '/:id',
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
                    if ((params["cache"] !== undefined) && (params["cache"] == true)) {
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
                            return deferred.resolve(_cache[key]);
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
    

