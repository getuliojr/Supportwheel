(function () {

    'use strict';

    /**
     * @ngdoc overview
     * @name components.core.chooseLanguage
     * @description
     *
     * # chooseLanguage - Component #
     *
     * This module is responsible to show the menu for the user to choose a language for the site and also
     * responsible to force a modal for the user to choose a language if none has ever been selected.
     *
     * @example
       <pre>
        <choose-language><choose-language />
       </pre>
     */
    angular
        .module('components.core.chooseLanguage', [
            'shared.services.service.culture'
        ])

        .directive('chooseLanguage', chooseLanguageDirective)
        .controller('ChooseLanguageController', ChooseLanguageController);

    /**
     * @ngdoc directive
     * @name components.core.chooseLanguage.directive:chooseLanguage
     * @restrict 'E'
     * @description
     *
     * This directive render the template for the menu for the user to choose a language for the application.
     *
     */
    function chooseLanguageDirective() {
        return {
            restrict: 'E',
            controller: 'ChooseLanguageController',
            templateUrl: 'app/components/core/chooseLanguage/chooseLanguage.html',
            controllerAs: 'language'
        }
    }

    //Injeta dependencias
    ChooseLanguageController.$inject = ['cultureService'];

    /**
     * @ngdoc controller
     * @name components.core.chooseLanguage.controller:ChooseLanguageController
     * @requires shared.services.service.culture
     * @description
     *
     * This controller is responsible to mainly to allow the user to change the current language in the site
     *
     */
    function ChooseLanguageController(cultureService) {
        var vm = this;

        //Referencia os metodos disponíveis
        vm.changeLanguage = changeLanguage;
        vm.getName = getName;

        /**
        * @ngdoc function
        * @name getName
        * @methodOf components.core.chooseLanguage.controller:ChooseLanguageController
        * @returns {string} It returns the name of the currente culture selected
        *
        * @description
        *
        * Responsable to get the name of the current culture selected.
        */
        function getName() {

            var current = cultureService.getCulture();

            if (current != undefined) {
                return current.name;
            } else {
                return "Clique para escolher um idioma"
            }
        }


        /**
       * @ngdoc function
       * @name changeLanguage
       * @methodOf components.core.chooseLanguage.controller:ChooseLanguageController
       * @param {string} culture expect a culture in the format 'pt-BR'
       *
       * @description
       *
       * Responsable to set a new culture in the application.
       */
        function changeLanguage(culture) {
            cultureService.setCulture(culture);
        }

    }
})();