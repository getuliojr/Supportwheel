(function () {

    'use strict';

    angular.module('shared.services.service', [
        'shared.services.service.culture',
        'shared.services.service.hub',     
        'shared.services.service.notification',
        'shared.services.service.retryQueue',
        'shared.services.service.security',
        'shared.services.service.user',
      'shared.services.service.viewstate',
        'shared.services.service.schedule'
    ]);

})();
