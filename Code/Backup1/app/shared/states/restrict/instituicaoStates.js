(function () {

    'use strict';

    angular.module('App').config(rotas);

    rotas.$inject = ['$stateProvider'];

    function rotas($stateProvider) {

        $stateProvider
            .state('instituicao', { //Tabs - Defaults to list
                url: '/restrita/instituicao',
                abstract: true,
                views:{
                    '@': {
                        template: '<create-tabs title="create.title" tabs="create.tabs" current-tab-index="$resolve.tab.index" current-view="$resolve.current"></create-tabs />',
                        resolve: {
                            tabs: function () {
                                return [{ tabName: "TABS.INSTITUICAO.SEARCH", tabIcon: "search", tabViewName: "search", tabStates:["instituicao.search"] },
                                    { tabName: "TABS.INSTITUICAO.INSTITUICAO", tabIcon: "note_add", tabViewName: "instituicao", tabStates: ["instituicao", "instituicao.instituicao", "instituicao.form"] }
                                ];
                            },
                            title: function () { return "TABS.INSTITUICAO.TITLE"; }
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

            .state('instituicao.search', {
                url: '/search',
                views: {
                    'search': {
                        template: '<abc-instituicao-search></abc-projeto-search>'
                    },
                    'instituicao': {
                        template: '<abc-instituicao-form></abc-projeto-new>'
                    }
                }
            })
            .state('instituicao.instituicao', {
                url: '',
                views: {
                    'search': {
                        template: '<abc-instituicao-search></abc-projeto-search>'
                    },
                    'instituicao': {
                        template: '<abc-instituicao-form></abc-instituicao-form>'
                    }
                }
            })

            .state('instituicao.form', //Visualizar registro (atualizar e apagar)
            {
                url: '/{id:[0-9]*}',
                views: {
                    'search': {
                        template: '<abc-instituicao-search></abc-projeto-search>'
                    },
                    'instituicao': {
                        template: '<abc-instituicao-form id="$resolve.intIdInstituicao"></abc-instituicao-form>',
                        resolve: {
                            intIdInstituicao: ['$stateParams', function ($stateParams) {
                                return $stateParams.id
                            }]
                        }
                    }
                }
            })

    }

})();
