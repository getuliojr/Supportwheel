(function() {

    'use strict';

    //Define o módulo
    angular
        .module('modules.topic.controllers', [
            'modules.topic.controllers.listTopic',
            'modules.topic.controllers.newTopic',
            'modules.topic.controllers.viewTopic'
        ]);
})();