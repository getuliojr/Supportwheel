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
    ListTopicController.$inject = ['topicList', 'securityService', 'topicService', 'commentService', '$rootScope'];
    
    //Cria o módulo
    function ListTopicController(topicList, securityService, topicService, commentService, $rootScope) {
        var vm = this;

        //Instancia variáveis que irão receber os dados
        vm.topicList = topicList;
        vm.isAuthenticated = securityService.isAuthenticated;

        topicService.listenEvent.all(reloadTopic);
        commentService.listenEvent.inserted(addComment);

        //If updated, deleted or inserted a new topic, update view
        function reloadTopic(broadcastedMessage) {            
            topicService.carregar().then(function (data) {
                angular.extend(vm.topicList, data);
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