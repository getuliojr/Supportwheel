import angular from 'angular';

ViewstateService.$inject = [];

class ViewstateService {

    constructor() {
        //Variaveis privadas
        this._views = [];
        this._lastView = {};

        this._createUniqueId = function () {
            var dateObject = new Date();
            var uniqueId = dateObject.getFullYear() + '' +
                dateObject.getMonth() + '' +
                dateObject.getDate() + '' +
                dateObject.getTime();
            return uniqueId;
        }
    }

    getHistory(viewName) {
        if (!viewName)
            throw "O nome da view não foi informado.";
        else {
            if (_views[viewName]) {
                return this._views[viewName];
            } else {
                return null;
            }
        }
    };
    getView(viewName, viewId) {
        if (!viewName)
            throw "O nome da view não foi informado.";
        else {
            if (this._views[viewName]) {
                if (!viewId)
                    return this._views[viewName][this._views[viewName].length - 1];
                else {
                    //implementar para permitir voltar no histórico
                }
            } else {
                return saveView(viewName, {});
            }
        }
    };
    getLastView() {
        return this._lastView;
    };
    newView(viewName) {
        if (!viewName)
            throw "O nome da view não foi informado.";
        else {
            var currentView = getView(viewName);
            if (currentView == null)
                return saveView(viewName, {});
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

                return saveView(viewName, myNewView);
            }
        }
    };
    saveView(viewName, viewData) {
        if (viewName && viewData) {
            var viewId = this._createUniqueId(); //Gera um ID único para identificacao
            viewData.viewInfo = { viewId: viewId, createdAt: new Date() }; //Insere informações do ID nos dados;
            if (!this._views[viewName])
                this._views[viewName] = [];
            this._views[viewName].push(viewData); //Adiciona
            this._lastView = viewData;
            return viewData;
        }
    };
}

export default angular
    .module('app.shared.services.viewstate', [])
    .service('viewstateService', ViewstateService)
    .name;