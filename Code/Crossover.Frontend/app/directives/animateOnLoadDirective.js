(function () {

    'use strict';

    angular.module('directives.animateOnLoad', [

    ])

    .directive('animateOnLoad', animateOnLoad);

    //************************************
    //  Diretiva
    //************************************

    //Injeta dependencias da diretiva
    animateOnLoad.$inject = ['$animateCss'];

    function animateOnLoad($animateCss) {
        return {
            'link': function (scope, element) {
                $animateCss(element, {
                    'event': 'enter',
                    structural: true
                }).start();
            }
        }
    }
})();