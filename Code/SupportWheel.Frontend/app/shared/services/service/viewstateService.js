(function () {

    'use strict';

    angular.module('shared.services.service.viewstate', [
    ])

    .service('viewstateService', viewstateService);

    //Injeta dependencias
    viewstateService.$inject = [];

    function viewstateService () {

        //Variaveis privadas
        var _views = [];
        var _lastView = {};
        
        //Api Publica
        this.getHistory =  getHistory;
        this.getView =  getView;
        this.getLastView = getLastView;
        this.newView = newView;
        this.saveView = saveView;

        //Funções
        function getHistory(viewName) {
            if (!viewName)
                throw "O nome da view não foi informado.";
            else {
                if (_views[viewName]) {
                    return _views[viewName];
                } else {
                    return null;
                }
            }
        };
        function getView (viewName, viewId) {
            if (!viewName)
                throw "O nome da view não foi informado.";
            else {
                if (_views[viewName]) {
                    if (!viewId)
                        return _views[viewName][_views[viewName].length - 1];
                    else {
                        //implementar para permitir voltar no histórico
                    }
                } else {
                    return this.saveView(viewName, {});
                }
            }
        };
        function getLastView () {
            return _lastView;
        };
        function newView (viewName) {
            if (!viewName)
                throw "O nome da view não foi informado.";
            else {
                var currentView = this.getView(viewName);
                if (currentView == null)
                    return this.saveView(viewName, {});
                else {
                    var myNewView = {};
                    for (var key in currentView) {
                        if ((key != "viewInfo") && (key.substring(0, 1) != "$")) {
                            if (currentView[key] instanceof Array) {
                                myNewView[key] = [];
                            } else if ((typeof (currentView[key] === "number")) || (typeof (currentView[key] === "string"))) {
                                myNewView[key] = "";
                            } else if (typeof (currentView[key] === "object")) {
                                myNewView[key] = {};
                            } else {
                                myNewView[key] = currentView[key];
                            }
                        }
                    }

                    return this.saveView(viewName, myNewView);
                }
            }
        };
        function saveView(viewName, viewData) {
            if (viewName && viewData) {
                var viewId = _createUniqueId(); //Gera um ID único para identificacao
                viewData.viewInfo = { viewId: viewId, createdAt: new Date() }; //Insere informações do ID nos dados;
                if (!_views[viewName])
                    _views[viewName] = [];
                _views[viewName].push(viewData); //Adiciona
                _lastView = viewData;
                return viewData;
            }
        };

        //Funções Auxiliares
        function _createUniqueId() {
            var dateObject = new Date();
            var uniqueId = dateObject.getFullYear() + '' +
                           dateObject.getMonth() + '' +
                           dateObject.getDate() + '' +
                           dateObject.getTime();
            return uniqueId;
        };
    }
})();