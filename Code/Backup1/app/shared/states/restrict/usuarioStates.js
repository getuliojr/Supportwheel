(function () {

    'use strict';

    angular.module('App').config(rotas);

    rotas.$inject = ['$stateProvider'];

    function rotas($stateProvider) {

        $stateProvider
            .state('usuario', { //Tabs - Defaults to list
                url: '/restrita/usuario',
                abstract: true,
                views:{
                    '@': {
                        template: '<create-tabs title="create.title" tabs="create.tabs" current-tab-index="$resolve.tab.index" current-view="$resolve.current"></create-tabs />',
                        resolve: {
                            tabs: function () {
                                return [{ tabName: "TABS.USUARIO.SEARCH", tabIcon: "search", tabViewName: "search", tabStates: ["usuario.search"] },
                                    { tabName: "TABS.USUARIO.USUARIO", tabIcon: "note_add", tabViewName: "usuario", tabStates: ["usuario", "usuario.usuario", "usuario.new", "usuario.form"] }
                                ];
                            },
                            title: function () { return "TABS.USUARIO.TITLE"; }
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

            .state('usuario.search', {
                url: '/search',
                views: {
                    'search': {
                        template: ''
                    },
                    'usuario': {
                        template: '<abc-usuario-new></abc-usuario-new>'
                    }
                }
            })
            .state('usuario.usuario', {
                url: '',
                views: {
                    'search': {
                        template: ''
                    },
                    'usuario': {
                        template: '<abc-usuario-new></abc-usuario-new>'
                    }
                }
            })

            .state('usuario.form', //Visualizar registro (atualizar e apagar)
            {
                url: '/{id:[0-9]*}',
                views: {
                    'search': {
                        template: ''
                    },
                    'usuario': {
                        template: '<abc-usuario-form id="$resolve.intIdUsuario"></abc-usuario-form>',
                        resolve: {
                            intIdUsuario: ['$stateParams', function ($stateParams) {
                                return $stateParams.id
                            }]
                        }
                    }
                }
            })

    }

})();
