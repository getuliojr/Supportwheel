(function () {

    'use strict';

    //Define o módulo
    angular
        .module('modules.topic.controllers.newTopic', [
            'modules.common.services.service.notification',
            'modules.common.services.factory.handleException'
        ])
        .controller('NewTopicController', NewTopicController);

    //Injeta dependencias
    NewTopicController.$inject = ['topicService', 'notificationService', '$state', 'handleExceptionFactory'];
    
    //Cria o módulo
    function NewTopicController(topicService, notificationService, $state, handleExceptionFactory) {
        var vm = this;

        //Instancia variáveis que irão receber os dados
        vm.dados = {};

        //Referencia os metodos disponíveis
        vm.save = save;


        //******************************
        //Abaixo métodos do controle
        //******************************
        //New Topic
        function save(topic) {
              topicService.salvar(topic).then(success, handleExceptionFactory);

            function success(insertedTopic) {
                notificationService.show('success', "The topic has been successfully created.");               
                $state.go('topic.view.index', { intIdTopic: insertedTopic.intIdTopic });
            }
        }

    }
})();