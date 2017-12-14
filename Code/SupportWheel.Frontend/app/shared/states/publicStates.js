(function () {

    'use strict';

    angular.module('App').config(rotas);

    rotas.$inject = ['$stateProvider'];

    function rotas($stateProvider) {

      $stateProvider
        .state('public',
        {
          url: '/',
          abstract: true,
          requireAuthenticatedUser: false,
          template: '<div ui-view></div>',

        })

        .state('public.about', {
          url: 'about',
          template: '<sw-about></sw-about>',
          resolve: {
           
            title: function () { return "TABS.PROJECT.TITLE"; }
          },
        })

    }

})();
