(function () {

    'use strict';

    //Configura as rotas do módulo sample
    angular.module('CrossoverApp').config(novasRotas);


    //Injeta as dependências do modulo para funcionar corretamente quando rodar tarefa de minify
    novasRotas.$inject = ['$stateProvider', '$urlRouterProvider', 'authorizationProvider'];

    //Define rotas
    function novasRotas($stateProvider, $urlRouterProvider, authorizationProvider) {

        $stateProvider
            .state('sample', {
                url: '/sample',
                templateUrl: 'app/modules/sample/views/default.html',
                controller: 'SampleController as sample',
                requireAuthenticatedUser: true
            })
            
            .state('sampleEdit',
            {
                url: '/sample/{id:[0-9]*}',
                templateUrl: 'app/modules/sample/views/default.html',
                controller: 'SampleController as sample',
                allowedRoles: ['SuperUser']
            })
            .state('sampleNew', {
                url: '/sample/new',
                templateUrl: 'app/modules/sample/views/default.html',
                controller: 'SampleController as sample',
                allowedRoles: ['Admin']
            })
            .state('sampleResource', {
                url: '/sample/resource',
                templateUrl: 'app/modules/sample/views/default.html',
                controller: 'SampleController as sample'
            })
            ;


    }
    
})();