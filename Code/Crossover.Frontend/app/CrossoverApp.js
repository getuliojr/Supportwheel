'use strict';

angular.module('CrossoverApp', ['ngAnimate', 'ngResource', 'angular-loading-bar', 'directives', 'filters', 'modules',
    'ui.router', 'ngStorage', 'angular-jwt', 'ngMaterial', 'ngMessages'])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {


        //url padrão para todos os casos que nao encontrar nada
        $urlRouterProvider.otherwise("/sample");

        // FIX for trailing slashes. Gracefully "borrowed" from https://github.com/angular-ui/ui-router/issues/50
        $urlRouterProvider.rule(function ($injector, $location) {

            var re = /(.+)(\/+)(\?.*)?$/;
            var path = $location.url();

            if (path && re.test(path)) {
                return path.replace(re, '$1$3');
            }

            return false;
        });

        // configura para funcionar como html5, necessário regras de rewrite no web.config
        $locationProvider.html5Mode(true).hashPrefix('!');

    }
])

//Configura o Prefixo para o Localstorage
.config(['$localStorageProvider',
    function ($localStorageProvider) {
        $localStorageProvider.setKeyPrefix('Crossover');
    }])


//Configura o Interceptor para inserir o token e chamar o pop-up de autenticação
.config(['$httpProvider',
    function ($httpProvider) {
        $httpProvider.interceptors.push('interceptorFactory');
    }])

//Configura a carga no template-cache de certos itens como os erros comuns
.run(function ($templateCache, $http) {
	$http.get('app/modules/common/views/formMessages.html')
		.then(function(response) {
			$templateCache.put('form-messages', response.data);
		})
})
;






;

