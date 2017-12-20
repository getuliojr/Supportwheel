'use strict';

angular.module('App', ['ngAnimate', 'ngResource', 'ngSanitize', 'angular-loading-bar', 'shared', 'components', 
  'ui.router', 'ngStorage', 'angular-jwt', 'ngMaterial', 'ngMessages', 'SignalR', 'pascalprecht.translate', 'md.data.table', 'angular.filter'])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {


        //url padrão para todos os casos que nao encontrar nada
        $urlRouterProvider.otherwise("/");

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

//Angular material theme
.config(function($mdThemingProvider) {
    //placeholder/foreground color
    $mdThemingProvider.theme('default').foregroundPalette[3] = "rgba(0,0,0,0.67)";
})

//Configura o Prefixo para o Localstorage
.config(['$localStorageProvider',
    function ($localStorageProvider) {
        $localStorageProvider.setKeyPrefix('SupportWheel');
    }])


//Configura o Interceptor para inserir o token e chamar o pop-up de autenticação
.config(['$httpProvider',
    function ($httpProvider) {
        $httpProvider.interceptors.push('interceptorFactory');
    }])

//Configure translations
.config(['$translateProvider',
    function ($translateProvider) {
        $translateProvider
			.useStaticFilesLoader({
			    prefix: 'app/locales/',
			    suffix: '.json'
			})
			.registerAvailableLanguageKeys(['en', 'es', 'fr', 'pt'], {
			    'en-US': 'en',
			    'es-ES': 'es',
			    'fr-FR': 'fr',
			    'pt-BR': 'pt'
			})
            .useSanitizeValueStrategy('sanitizeParameters')
           // .useLocalStorage()
        ;
    }])

//.config(['$compileProvider', function ($compileProvider) {
//        $compileProvider.debugInfoEnabled(false);
//}])

//Configura a carga no template-cache de certos itens como os erros comuns
.run(function ($templateCache, $http, $rootScope) {
    $http.get('app/shared/views/formMessages.html')
		.then(function (response) {
		    $templateCache.put('form-messages', response.data);
		});

    //shows errors in dependencies injected by resolve in ui-router state configuration
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        console.error(error);
    });
})
;
