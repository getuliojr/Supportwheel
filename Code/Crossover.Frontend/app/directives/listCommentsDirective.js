//List all Comments added to a post

(function () {

    'use strict';

    angular.module('directives.listComments', [
        'modules.comment.services.service.comment',
        'modules.topic.services.service.topic'
    ])

    .controller('listCommentsController', listCommentsController)


    .directive('listComments', listComments);

    //************************************
    //  Diretiva
    //************************************

    //Injeta dependencias da diretiva
    listCommentsController.$inject = ['topicService','commentService'];
    listComments.$inject = [];

    function listCommentsController(topicService, commentService) {
        var vm = this;
        vm.data = {};
        vm.data.commentsList = this.commentsList;

        commentService.listenService(reloadTopic);

        function reloadTopic(broadcastedMessage) {
            topicService.carregar({ intIdTopic: broadcastedMessage.data.intIdTopic })
                .then(function (data) {
                    angular.extend(vm.data.commentsList, data.comments);
                });
        }
    }

    function listComments() {
        return {
            restrict: 'E',
            templateUrl: 'app/modules/comment/views/listComments.html',
            controllerAs: 'comment',
            controller: listCommentsController,
            bindToController: true,
            scope: {
                commentsList: '=commentslist'
            },
        }
    }

})();