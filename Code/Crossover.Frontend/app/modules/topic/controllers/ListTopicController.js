(function () {

    'use strict';

    //Define o módulo
    angular
        .module('modules.topic.controllers.listTopic', [
            'modules.common.services.service.security'
        ])
        .controller('ListTopicController', ListTopicController);

    //Injeta dependencias
    ListTopicController.$inject = ['topicList', 'securityService'];
    
    //Cria o módulo
    function ListTopicController(topicList, securityService) {
        var vm = this;

        //Instancia variáveis que irão receber os dados
        vm.topicList = topicList;
        vm.isAuthenticated = securityService.isAuthenticated;

        
    }
})();