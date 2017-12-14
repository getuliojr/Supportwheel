(function () {

    'use strict';

    angular.module('App').config(rotas);

    rotas.$inject = ['$stateProvider'];

    function rotas($stateProvider) {

        $stateProvider
            .state('project', { //Tabs - Defaults to list
                url: '/restrita/project',
                abstract: true,
                views:{
                    '@': {
                        template: '<create-tabs title="create.title" tabs="create.tabs" current-tab-index="$resolve.tab.index" current-view="$resolve.current"></create-tabs />',
                        resolve: {
                            tabs: function () {
                                return [{ tabName: "TABS.PROJECT.SEARCH", tabIcon: "search", tabViewName: "search", tabStates:["project.search"] },
                                    { tabName: "TABS.PROJECT.PROJECT", tabIcon: "note_add", tabViewName: "project", tabStates:["project", "project.project", "project.view", "project.view.index", "project.view.edit"] }
                                ];
                            },
                            title: function () { return "TABS.PROJECT.TITLE"; }
                        },
                        controller: function (tabs, title) {
                            var vm = this;
                            vm.tabs = tabs;
                            vm.title = title;
                        },
                        controllerAs: 'create'
                    }
                    
                },
                requireAuthenticatedUser: true
               
            })

            .state('project.search', {
                url: '/search',
                views: {
                    'search': {
                        template: '<abc-projeto-search allow-edit="true"></abc-projeto-search>'
                    },
                    'project': {
                        template: '<abc-projeto-new></abc-projeto-new>'
                    }
                }
            })
            .state('project.project', {
                url: '',
                views: {
                    'search': {
                        template: '<abc-projeto-search  allow-edit="true"></abc-projeto-search>'
                    },
                    'project': {
                        template: '<abc-projeto-new></abc-projeto-new>'
                    }
                }
            })

            .state('project.view', //Visualizar registro (atualizar e apagar)
            {
                url: '/{id:[0-9]*}',
                abstract: true,
                views: {
                    'search': {
                        template: '<abc-projeto-search  allow-edit="true"></abc-projeto-search>'
                    },
                    'project': {
                        template: '<ui-view/>'
                        
                    }
                }
            })

            .state('project.view.index', //Visualizar 
            {
                url: '',
                template: '<abc-projeto-view id="$resolve.projeto"></abc-projeto-view>',

                resolve: {
                    projeto: ['$stateParams', function ($stateParams) {
                        return $stateParams.id
                    }]
                }
              
            })

            .state('project.view.edit', //Atualiza e apaga
            {
                url: '/edit',
                template: '<abc-projeto-form id="$resolve.projeto"></abc-projeto-form>',

                resolve:{ projeto: ['$stateParams', function($stateParams) {
                    return $stateParams.id
                }]
                }
            })
        

    }

})();
