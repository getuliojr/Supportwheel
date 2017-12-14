(function () {

    'use strict';

    angular.module('shared.services.factory', [
        'shared.services.factory.interceptor',
        'shared.services.factory.mockHttp',
        'shared.services.factory.appResource',
        'shared.services.factory.handleException'
    ]);

})();