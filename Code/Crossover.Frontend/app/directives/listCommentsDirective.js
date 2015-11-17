//List all Comments added to a post

(function () {

    'use strict';

    angular.module('directives.listComments', [

    ])

    .directive('listComments', listComments);

    //************************************
    //  Diretiva
    //************************************

    //Injeta dependencias da diretiva
    listComments.$inject = [];

    function listComments() {
        return {
            restrict: 'E',
            templateUrl: 'app/modules/comment/views/listComments.html',
            controllerAs: 'comment',
            bindToController: true,
            controller: function(){},
            scope: {
                commentsList: '=commentslist'
            },
        }
    }

})();