(function () {

    'use strict';

    angular.module('modules.common.services.factory', [
        'modules.common.services.factory.interceptor',
        'modules.common.services.factory.mockHttp',
        'modules.common.services.factory.appResource'
    ]);

})();