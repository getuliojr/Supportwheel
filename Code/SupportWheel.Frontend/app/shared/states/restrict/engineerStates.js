(function () {

    'use strict';

    angular.module('App').config(rotas);

    rotas.$inject = ['$stateProvider'];

    function rotas($stateProvider) {

        $stateProvider
            .state('engineer', { //Tabs - Defaults to list
                url: '/restrict/engineer',
                abstract: true,
                views:{
                    '@': {
                        template: '<create-tabs title="create.title" tabs="create.tabs" current-tab-index="$resolve.tab.index" current-view="$resolve.current"></create-tabs />',
                        resolve: {
                            tabs: function () {
                                return [{ tabName: "TABS.ENGINEER.SEARCH", tabIcon: "search", tabViewName: "search", tabStates:["engineer.search"] },
                                  { tabName: "TABS.ENGINEER.ENGINEER", tabIcon: "note_add", tabViewName: "engineer", tabStates: ["engineer", "engineer.engineer", "engineer.form"] }
                                ];
                            },
                            title: function () { return "TABS.ENGINEER.TITLE"; }
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

          .state('engineer.search', {
                url: '/search',
                views: {
                    'search': {
                        template: '<sw-engineer-list></sw-engineer-list>'
                    },
                    'engineer': {
                        template: '<sw-engineer-form></sw-engineer-form>'
                    }
                }
            })
          .state('engineer.engineer', {
                url: '',
                views: {
                    'search': {
                      template: '<sw-engineer-list></sw-engineer-list>'
                    },
                    'engineer': {
                      template: '<sw-engineer-form></sw-engineer-form>'
                    }
                }
            })

          .state('engineer.form', //Visualizar registro (atualizar e apagar)
            {
                url: '/{id:[0-9]*}',
                views: {
                    'search': {
                      template: '<sw-engineer-list></sw-engineer-list>'
                    },
                    'engineer': {
                        template: '<sw-engineer-form id="$resolve.intIdEngineer"></sw-engineer-form>',
                        resolve: {
                            intIdEngineer: ['$stateParams', function ($stateParams) {
                                return $stateParams.id
                            }]
                        }
                    }
                }
            })

    }

})();
