(function () {

    'use strict';

    //Define o módulo
    angular
        .module('modules.topic.controllers.viewTopic', [
            'modules.common.services.service.notification',
            'modules.common.services.service.security',
            'modules.topic.services.service.topic',
            'modules.comment.services.service.comment'
            
        ])
        .controller('ManterTopicController', ManterTopicController);

    //Injeta dependencias
    ManterTopicController.$inject = ['topic', 'securityService', 'topicService', 'notificationService', '$state','commentService'];
    
    //Cria o módulo
    function ManterTopicController(topic, securityService, topicService, notificationService, $state, commentService) {
        var vm = this;

        //Instancia variáveis que irão receber os dados
        vm.data = topic;

        //Referencia os metodos disponíveis
        vm.userCreatedTopic = userCreatedTopic;
        vm.save = save;
        vm.deleteTopic = deleteTopic;


        
        //init();


        //******************************
        //Abaixo métodos do controle
        //******************************

        function init() {
            var subscribeCommentService = commentService.listenService(reloadTopic);

            function reloadTopic(broadcastedMessage) {
                topicService.carregar({ intIdTopic: broadcastedMessage.data.intIdTopic })
                    .then(function (data) {
                        angular.extend(vm.data.comments, data.comments);
                    });
            }
        }

        //Check if the current user created the topic, if so, allow to edit
        function userCreatedTopic(intIdUserCreated) {
            var currentUser = securityService.currentUser();
            return currentUser.intIdUser === intIdUserCreated;
        }
        
        //Save topic
        function save(topic) {
            topicService.salvar(topic).then(success, error);

            function success(updatedTopic) {
                notificationService.show('success', "The topic has been successfully updated.");
                $state.go('topic.view.index', { intIdTopic: topic.intIdTopic }, { reload: true });
            }

            function error(error) {
                console.log("erro:" + error);
            }
        }

        function deleteTopic(intIdTopic) {
            topicService.remover({ intIdTopic: intIdTopic }).then(success, error);

            function success() {
                notificationService.show('success', "The topic has been deleted.");
                $state.go('topic.list');
            }

            function error(error) {
                console.log("erro:" + error);
            }
        }
    }
})();