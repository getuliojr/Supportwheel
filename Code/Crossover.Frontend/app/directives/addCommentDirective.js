//List all Comments added to a post

(function () {

    'use strict';

    angular.module('directives.addComment', [
        'modules.comment.controllers.newComment'
    ])

    .directive('addComment', addComment);

    //************************************
    //  Diretiva
    //************************************

    //Injeta dependencias da diretiva
    addComment.$inject = [];

    function addComment() {
        return {
            restrict: 'E',
            templateUrl: 'app/modules/comment/views/formComment.html',
            controller: 'NewCommentController',
            controllerAs: 'comment',
            bindToController: true,
            scope: {
                intIdTopic: '=intidtopic'
            },
        }
    }

})();