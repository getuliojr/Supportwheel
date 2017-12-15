(function () {

    'use strict';

    angular.module('App').config(rotas);

    rotas.$inject = ['$stateProvider'];

    function rotas($stateProvider) {

      $stateProvider
        .state('home',
        {
          url: '/',
          requireAuthenticatedUser: false,
          template: '<sw-home></sw-home>',

        })

        .state('about', {
          url: '/about',
          template: '<sw-about></sw-about>',
        })

    }

})();
