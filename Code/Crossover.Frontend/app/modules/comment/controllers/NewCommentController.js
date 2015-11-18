(function () {

    'use strict';

    //Define o módulo
    angular
        .module('modules.comment.controllers.newComment', [
            'modules.comment.services.service.comment',
            'modules.common.services.service.notification'
        ])
        .controller('NewCommentController', NewCommentController);

    //Injeta dependencias
    NewCommentController.$inject = ['commentService', 'notificationService', '$state'];
    
    //Cria o módulo
    function NewCommentController(commentService, notificationService, $state) {
        var vm = this;

        //Instancia variáveis que irão receber os dados
        vm.data = {};

        //Referencia os metodos disponíveis
        vm.reply = reply;


        //******************************
        //Abaixo métodos do controle
        //******************************

        function reply(comment, intIdTopic) {

            if (!comment.hasOwnProperty("intIdTopic")) {
                comment.intIdTopic = intIdTopic; //Set Id Topic if it is not available in the data
            }

            //Save comment
            commentService.salvar(comment).then(success, error);

            function success(inserted) {
                vm.data.txtComment = undefined;
                notificationService.show('success', "The comment has been successfully added.");
                //Reload state, so it show new comments
                $state.go('topic.view.index', { intIdTopic: inserted.intIdTopic }, { reload: true });
            }

            function error(error) {
                console.log("erro:" + error);
            }
        }

    }
})();