// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
// Source inspired by the book: https://github.com/angular-app
(function () {

    'use strict';

    angular.module('shared.services.service.security', [
        'shared.services.service.baseUrl',
        'shared.services.service.retryQueue',
        'shared.services.factory.appResource',
        'shared.services.service.usuario'
    ])


    /**
     * @ngdoc service
     * @name shared.services.service.service:security
     * @description
     *
     * This service is responsible for the authentication features in the site.
     * It is the interface between the client and the server
     *
     */
    .service('securityService', securityService);

    //Injeta dependencias
    securityService.$inject = ['$http', '$state', '$localStorage', '$q', '$location', 'retryQueueService', 'appResourceFactory',
        'baseUrlService', '$mdDialog', 'usuarioService'];

    function securityService($http, $state, $localStorage, $q, $location, retryQueueService, appResourceFactory,
        baseUrlService, $mdDialog, usuarioService) {
        var that = this;

        var _lastAuthError = undefined;                 //Mantem o último erro de authenticação
        var loginModalOpened = false;                   //Informa se o login já foi aberto ou não

        // Register a handler for when an item is added to the retry queue
        retryQueueService.onItemAddedCallbacks.push(function (retryItem) {
            if (retryQueueService.hasMore()) {
                that.showLogin();
            }
        });

        // The public API of the service
        this.cancelLogin = cancelLogin;                   // Give up trying to login and clear the retry queue
        this.currentUser = currentUser;                   // Usuario Atual
        this.getLastAuthError = getLastAuthError;         // Get  last error of the login
        this.getLoginReason = getLoginReason;             // Get the first reason for needing a login
        this.isAuthenticated = isAuthenticated;           // Is the current user authenticated?
        this.login = login;                               // user: {email, password}
        this.logout = logout;                             // Logout the current user and redirect
        this.requestCurrentUser = requestCurrentUser;     // Busca informações do usuário atual
        this.showLogin = showLogin;                       // Show the modal login dialog
        this.closeLogin = closeLogin;                     // Close the modal login dialog
        this.token = token;                               // token
        


        //Private Functions
        function cancelLogin(rota) {
            $mdDialog.hide(); //Fecha o login
            retryQueueService.cancelAll(); //Cancela chamadas pendentes
            redirect(rota); //Redireciona para a rota informada
        };
        function currentUser() {
            return $localStorage.user;
        }
        function getLastAuthError() {
            return _lastAuthError;
        }
        function getLoginReason () {
            var reason = retryQueueService.retryReason();
            
            if (reason == "unauthenticated-client") {
                return "SECURITY.UNAUTHENTICATED-CLIENT";
            } else if (reason == "unauthorized-client" || reason == "unauthorized-server") {
                return "SECURITY.UNAUTHORIZED-CLIENT";
            }else{
                return "SECURITY.UNAUTHENTICATED-CLIENT";
            }
        };
        function isAuthenticated() {
            var user = that.currentUser();
            var token = that.token();
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
        function login(user) {
            //Mapeia dados
            _lastAuthError = undefined; //Limpa último erro a cada tentativa de login

            var data = "grant_type=password&username=" + user.username + "&password=" + user.password;
            var deferred = $q.defer();
            //Busca o token
            $http.post(baseUrlService.getBaseUrl() + "api/token", data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(loginResponse)
                .catch(loginResponse);

            return deferred.promise;

            //Funções Internas do login
            function loginResponse(response) {
                //Se conseguiu autenticar com sucesso, se tem o token
                if (response.data.hasOwnProperty("access_token")) {
                    $localStorage.token = response.data;
                    //Busca os dados do usuário atual com base no token recebido
                    that.requestCurrentUser()
                        .then(function (user) {
                            //Se teve sucesso e autenticou, fecha a caixa de diálogo e faz novas tentativas das chamadas pendentes
                            if (that.isAuthenticated()) {
                                $mdDialog.hide();
                            }
                            //Avisa que o login foi com sucesso
                            _lastAuthError = undefined;
                            deferred.resolve(response.data);
                        });
                } else {
                    //Avisa que o login foi com erro e sobe erro
                    _lastAuthError = response.data;
                    deferred.reject(response.data);
                }
            }
        };
        function logout(redirectTo) {
            //Apaga token e dados do usuario
            delete $localStorage.token;
            delete $localStorage.user;
            //redireciona para a raiz ou rota passada
            redirect(redirectTo);
        };
        function requestCurrentUser() {
            if (that.isAuthenticated()) {
                return $q.when(that.currentUser());
            } else {
                if (!that.token()) {
                    //Se ainda não tem token deve abrir um modal para o usuário se logar
                    return retryQueueService.pushRetryFn('unauthenticated-client', that.requestCurrentUser);
                }
                //TODO busca usuario atual e salva em currentUser
                return usuarioService.load({ action: 'current', loadOne: true })
                    .then(function (dados) {
                        $localStorage.user = dados;
                        return $q.when(that.currentUser());
                    });
            }

        };
        function showLogin() {
            //Se ainda não está aberto, abre, caso contrário ignora para evitar multiplus pop-ups.
            if (!loginModalOpened) {
                loginModalOpened = true;
                $mdDialog.show({
                    template: "<md-dialog flex-gt-lg='50' flex-lg='65' flex-md='70' flex-sm='100' style='max-width:500px;' aria-label='Login dialog'><md-dialog-content><login></login></md-dialog-content></md-dialog>",
                    parent: angular.element(document.body),
                    clickOutsideToClose: false
                }).then(function () {
                    loginModalOpened = false; //avisa que fechou o pop-up
                    retryQueueService.retryAll(); //Refaz ultimas chamadas na fila

                }, function (canceled) {
                    //Se o usuário cancelou, cancela chamadas pendentes e redireciona para a tela de login.
                    loginModalOpened = false;
                    $q.reject("Not Authorized"); //Cancel login and stateChange
                    retryQueueService.cancelAll();
                });
            }
        }

        function closeLogin() {
            if (loginModalOpened == true) {
                loginModalOpened = false;
                $mdDialog.hide();
            }
        }


        function token() {
            return $localStorage.token;
        }
        


        //*************************
        //Funções Auxiliares
        //*************************
        // Redirect to the given url (defaults to '/')
        function redirect(url) {
            url = url || '/login';
            $location.path(url);
        }
        
    }
})();
