(function () {

    'use strict';

    //Define o módulo
    angular
        .module('modules.topic.controllers.listTopic', [
            'modules.common.services.service.security',
            'modules.topic.services.service.topic',
            'modules.comment.services.service.comment'
        ])
        .controller('ListTopicController', ListTopicController);

    //Injeta dependencias
    ListTopicController.$inject = ['topicList', 'securityService', 'topicService', 'commentService', '$scope'];
    
    //Cria o módulo
    function ListTopicController(topicList, securityService, topicService, commentService, $scope) {
        var vm = this;

        //Instancia variáveis que irão receber os dados
        vm.topicList = topicList;
        vm.isAuthenticated = securityService.isAuthenticated;

        var topicEvent = topicService.listenEvent.all(reloadTopic);
        var commentEvent = commentService.listenEvent.inserted(addComment);

        //Cleanup events when controller is destroyed
        $scope.$on("$destroy", topicEvent);
        $scope.$on("$destroy", commentEvent);

        //If updated, deleted or inserted a new topic, update view
        function reloadTopic(broadcastedMessage) {            
            topicService.carregar({applyScope: true}).then(function (data) {
                vm.topicList = data;
            })
        }

        //Add new comment to the topic replied
        function addComment(broadcastedMessage) {
            var index = _.findIndex(vm.topicList, { intIdTopic: broadcastedMessage.data.intIdTopic });
            vm.topicList[index].intQtyComments++;
            vm.topicList[index].showNew = true;
        }
        
    }
})();