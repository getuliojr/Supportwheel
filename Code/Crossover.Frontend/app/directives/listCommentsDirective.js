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
    listCommentsController.$inject = ['$state','topicService','commentService', '$scope'];
    listComments.$inject = [];

    function listCommentsController($state, topicService, commentService, $scope) {
        var vm = this;

        var event = commentService.listenEvent.inserted(reloadTopic);

        function reloadTopic(broadcastedMessage) {
            topicService.carregar({ intIdTopic: broadcastedMessage.data.intIdTopic })
                .then(function (data) {
                    angular.extend(vm.commentsList, data.comments);
                });
        }

        $scope.$on("$destroy",  event);
    }

    function listComments() {
        return {
            restrict: 'E',
            templateUrl: 'app/modules/comment/views/listComments.html',
            controllerAs: 'listComments',
            controller: listCommentsController,
            bindToController: true,
            scope: {
                commentsList: '=commentslist'
            },
        }
    }

})();