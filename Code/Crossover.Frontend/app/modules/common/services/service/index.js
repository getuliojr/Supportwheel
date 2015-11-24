(function () {

    'use strict';

    angular.module('modules.common.services.service', [
        'modules.common.services.service.retryQueue',
        'modules.common.services.service.security',
        'modules.common.services.service.notification',
        'modules.common.services.service.viewstate',
        'modules.common.services.service.user',
        'modules.common.services.service.hub'
    ]);

})();