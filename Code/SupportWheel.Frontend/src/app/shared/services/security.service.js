import angular from 'angular';
import webApiService from './webApi.service.js';
import usuarioService from './usuario.service.js';
import retryQueueService from './retryQueue.service.js';
import baseUrlService from './baseUrl.service.js';



SecurityService.$inject = ['$http', '$state', '$localStorage', '$q', '$location', 'retryQueueService', 'webApiService',
    'baseUrlService', '$mdDialog', 'usuarioService'];

class SecurityService {

    constructor($http, $state, $localStorage, $q, $location, retryQueueService, webApiService, baseUrlService, $mdDialog, usuarioService) {
        this.$mdDialog = $mdDialog;
        this.$localStorage = $localStorage;
        this.retryQueueService = retryQueueService;
        this.$q = $q;
        this.$http = $http;
        this.usuarioService = usuarioService;

        //Mantem o último erro de authenticação
        let _lastAuthError = undefined;
        //Informa se o modal de login já foi aberto ou não
        let loginModalOpened = false;

        // Register a handler for when an item is added to the retry queue
        retryQueueService.onItemAddedCallbacks.push(function (retryItem) {
            if (retryQueueService.hasMore()) {
                showLogin();
            }
        });
    }

    //Private Functions
    cancelLogin(rota) {
        this.$mdDialog.hide(); //Fecha o login
        this.retryQueueService.cancelAll(); //Cancela chamadas pendentes
        redirect(rota); //Redireciona para a rota informada
    };
    currentUser() {
        return this.$localStorage.user;
    }
    getLastAuthError() {
        return _lastAuthError;
    }
    getLoginReason() {
        var reason = this.retryQueueService.retryReason();

        if (reason == "unauthenticated-client") {
            return "SECURITY.UNAUTHENTICATED-CLIENT";
        } else if (reason == "unauthorized-client" || reason == "unauthorized-server") {
            return "SECURITY.UNAUTHORIZED-CLIENT";
        } else {
            return "SECURITY.UNAUTHENTICATED-CLIENT";
        }
    };
    isAuthenticated() {
        let user = this.currentUser();
        let token = this.token();
        return !!user && !_.isEmpty(user) && !!token && !!token.access_token;
    };

    /**
    * @ngdoc function
    * @name login
    * @methodOf shared.services.service.service:security
    * @param {object} user Expect an object with two properties: 'username' and 'password'. Both are required.
    * @returns {object} It returns a promise that will be filled with the api response when it is resolved
    * @description
    * This is responsible to send user credentials to the server
    *
    */
    login(user) {
        //Mapeia dados
        this._lastAuthError = undefined; //Limpa último erro a cada tentativa de login

        let data = "grant_type=password&username=" + user.username + "&password=" + user.password;
        let deferred = this.$q.defer();
        //Busca o token
        this.$http.post(baseUrlService.getBaseUrl() + "api/token", data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .then(loginResponse)
            .catch(loginResponse);

        return deferred.promise;

        //Funções Internas do login
        function loginResponse(response) {
            //Se conseguiu autenticar com sucesso, se tem o token
            if (response.data.hasOwnProperty("access_token")) {
                this.$localStorage.token = response.data;
                //Busca os dados do usuário atual com base no token recebido
                this.requestCurrentUser()
                    .then(function (user) {
                        //Se teve sucesso e autenticou, fecha a caixa de diálogo e faz novas tentativas das chamadas pendentes
                        if (this.isAuthenticated()) {
                            this.$mdDialog.hide();
                        }
                        //Avisa que o login foi com sucesso
                        this._lastAuthError = undefined;
                        deferred.resolve(response.data);
                    });
            } else {
                //Avisa que o login foi com erro e sobe erro
                this._lastAuthError = response.data;
                deferred.reject(response.data);
            }
        }
    };
    logout(redirectTo) {
        //Apaga token e dados do usuario
        delete this.$localStorage.token;
        delete this.$localStorage.user;
        //redireciona para a raiz ou rota passada
        redirect(redirectTo);
    };
    requestCurrentUser() {
        if (this.isAuthenticated()) {
            return this.$q.when(this.currentUser());
        } else {
            if (!this.token()) {
                //Se ainda não tem token deve abrir um modal para o usuário se logar
                return this.retryQueueService.pushRetryFn('unauthenticated-client', that.requestCurrentUser);
            }
            //TODO busca usuario atual e salva em currentUser
            return this.usuarioService.load({ action: 'atual', loadOne: true })
                .then(function (dados) {
                    this.$localStorage.user = dados;
                    return $q.when(that.currentUser());
                });
        }

    };
    showLogin() {
        //Se ainda não está aberto, abre, caso contrário ignora para evitar multiplus pop-ups.
        if (!this.loginModalOpened) {
            this.loginModalOpened = true;
            this.$mdDialog.show({
                template: "<md-dialog flex-gt-lg='50' flex-lg='65' flex-md='70' flex-sm='100' style='max-width:500px;' aria-label='Login dialog'><md-dialog-content><login></login></md-dialog-content></md-dialog>",
                parent: angular.element(document.body),
                clickOutsideToClose: false
            }).then(function () {
                loginModalOpened = false; //avisa que fechou o pop-up
                retryQueueService.retryAll(); //Refaz ultimas chamadas na fila

            }, function (canceled) {
                //Se o usuário cancelou, cancela chamadas pendentes e redireciona para a tela de login.
                this.loginModalOpened = false;
                this.$q.reject("Not Authorized"); //Cancel login and stateChange
                this.retryQueueService.cancelAll();
            });
        }
    }

    closeLogin() {
        if (this.loginModalOpened == true) {
            this.loginModalOpened = false;
            this.$mdDialog.hide();
        }
    }


    token() {
        return this.$localStorage.token;
    }



    //*************************
    //Funções Auxiliares
    //*************************
    // Redirect to the given url (defaults to '/')
    redirect(url) {
        url = url || '/login';
        this.$location.path(url);
    }
}

export default angular
    .module('app.shared.services.security', [])
    .service('securityService', SecurityService)
    .name;