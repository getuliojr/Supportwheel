(function () {

    'use strict';

     /**
     * @ngdoc overview
     * @name components.home
     *
     * @description
     *
     * # home - Component #
     *
     * This component is responsible to render the home in the page
     *
     * @example
       <pre>
        <sw-home></sw-home>
       </pre>
     */
    angular
        .module('components.home', [])

        
    /**
    * @ngdoc directive
    * @name components.home.directive:home
    *
    * @restrict 'E'
    * 
    * @description
    *
    * This component will render the home page
    *
    */
    .component('swHome', {
        templateUrl: 'app/components/home/home.html',
        controller: HomeController,
        bindings: {

        }
    });

    /**
     * @ngdoc controller
     * @name components.home.controller:HomeController
     * @description
     *
     * It has the logic behind the component
     *
     */
    function HomeController() {

        
    }
})();
