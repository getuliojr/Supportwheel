(function () {

    'use strict';

     /**
     * @ngdoc overview
     * @name components.about
     *
     * @description
     *
     * # about - Component #
     *
     * This component is responsible to render information about this project
     *
     * @example
       <pre>
        <sw-about></sw-about>
       </pre>
     */
    angular
        .module('components.about', [])

        
    /**
    * @ngdoc directive
    * @name components.about.directive:swAbout
    *
    * @restrict 'E'
    * 
    * @description
    *
    * This component will show information about this project
    *
    */
    .component('swAbout', {
        templateUrl: 'app/components/about/about.html',
        controller: AboutController,
        bindings: {

        }
    });

    /**
     * @ngdoc controller
     * @name components.about.controller:AboutController
     * @description
     *
     * It has the logic behind the component
     *
     */
    function AboutController() {

        
    }
})();
