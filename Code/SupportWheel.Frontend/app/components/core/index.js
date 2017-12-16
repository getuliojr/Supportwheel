(function () {
    'use strict';

    /**
     * @ngdoc overview
     * @name components.core
     * @description
     *
     * # Core - Component #
     *
     * These components are part of the infra-instructure, core, of the application. 
     * 
     * Below is a list of the components. Click on each one for more information:
     *
     * - {@link components.core.auth auth}
     *
     * - {@link components.core.authenticatedMenu authenticatedMenu}
     *
     * - {@link components.core.chooseLanguage chooseLanguage}
     * 
     * - {@link components.core.dataList dataList}
     *
     * - {@link components.core.login login}
     */
    angular
        .module('components.core', [
            'components.core.auth',
            'components.core.authenticatedMenu',
            'components.core.chooseLanguage',
            'components.core.createTabs',
            'components.core.dataList',
          'components.core.login',
          'components.core.signup'
    ]);

})();

