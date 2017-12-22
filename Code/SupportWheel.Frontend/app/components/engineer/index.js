(function () {
    'use strict';

    /**
     * @ngdoc overview
     * @name components.engineer
     * @description
     *
     * # Engineer - Component #
     *
     * This components hold the functionalities to compose the screen to maintain registers of engineers.
     * 
     * Below is a list of the components. Click on each one for more information:
     *    
     * - {@link components.engineer.engineer.form engineerForm}
     * - {@link components.engineer.engineer.list engineerList}
     *     
     */
    angular
        .module('components.engineer', [
            'components.engineer.engineer.form',
            'components.engineer.engineer.list'
    ]);

})();

