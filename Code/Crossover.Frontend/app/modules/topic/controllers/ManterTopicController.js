(function () {

    'use strict';

    //Define o módulo
    angular
        .module('modules.topic.controllers.viewTopic', [
            'modules.common.services.service.notification',
            'modules.common.services.factory.handleException',
            'modules.common.services.service.security',
            'modules.topic.services.service.topic',
            'modules.comment.services.service.comment'
            
        ])
        .controller('ManterTopicController', ManterTopicController);

    //Injeta dependencias
    ManterTopicController.$inject = ['topic', 'securityService', 'topicService', 'notificationService', '$state','commentService', 'handleExceptionFactory'];
    
    //Cria o módulo
    function ManterTopicController(topic, securityService, topicService, notificationService, $state, commentService, handleExceptionFactory) {
        var vm = this;

        //Instancia variáveis que irão receber os dados
        vm.data = topic;

        //Referencia os metodos disponíveis
        vm.userCreatedTopic = userCreatedTopic;
        vm.save = save;
        vm.deleteTopic = deleteTopic;

        var topicDeletedEvent = topicService.listenEvent.deleted(topicDeleted);
        var topicUpdatedEvent = topicService.listenEvent.updated(topicUpdated);

        function topicUpdated(broadcastedMessage) {
            if (broadcastedMessage.data.intIdTopic == topic.intIdTopic) {
                //Own topic updated, refresh
                topicService.carregar({ intIdTopic: broadcastedMessage.data.intIdTopic, applyScope: true })
                    .then(function (data) {
                        angular.extend(vm.data, data);
                    })
            }
        };

        function topicDeleted(broadcastedMessage) {
            if (broadcastedMessage.data.intIdTopic == topic.intIdTopic && broadcastedMessage.from == "hub") {
                //Own topic deleted, move to topics list:
                notificationService.show('warning', "This topic has been deleted by its owner.");
                $state.go('topic.list', null, { reload: true });
            }
        };

        //Check if the current user created the topic, if so, allow to edit
        function userCreatedTopic(intIdUserCreated) {
            var currentUser = securityService.currentUser();
            return currentUser.intIdUser === intIdUserCreated;
        }
        
        //Update a topic
        function save(topic) {
            topicService.salvar(topic).then(success, handleExceptionFactory);

            function success(updatedTopic) {
                notificationService.show('success', "The topic has been successfully updated.");
                $state.go('topic.view.index', { intIdTopic: topic.intIdTopic }, { reload: true });
            }
        }
        //Delete a topic
        function deleteTopic(intIdTopic) {
            topicService.remover({ intIdTopic: intIdTopic }).then(success, handleExceptionFactory);

            function success() {
                notificationService.show('success', "The topic has been deleted.");
                $state.go('topic.list', null, { reload: true });
            }
        }
    }
})();