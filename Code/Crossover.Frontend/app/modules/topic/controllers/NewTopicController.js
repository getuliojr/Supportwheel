(function () {

    'use strict';

    //Define o módulo
    angular
        .module('modules.topic.controllers.newTopic', [
            'modules.common.services.service.notification',
            'modules.common.services.factory.handleException',
            'modules.common.services.service.viewstate'
        ])
        .controller('NewTopicController', NewTopicController);

    //Injeta dependencias
    NewTopicController.$inject = ['topicService', 'notificationService', '$state', 'handleExceptionFactory', 'viewstateService'];
    
    //Cria o módulo
    function NewTopicController(topicService, notificationService, $state, handleExceptionFactory, viewstateService) {
        var vm = angular.extend(this, viewstateService.getView('topic'));
       
        //Instancia variáveis que irão receber os dados
        //vm.dados = viewstateService.getView('topic');

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