(function () {

    'use strict';

    //Define o módulo
    angular
        .module('modules.topic.controllers.topic', [
            'modules.common.services.service.security'
        ])
        .controller('TopicController', TopicController);

    //Injeta dependencias
    TopicController.$inject = ['topicService', 'topicList', 'securityService'];
    
    //Cria o módulo
    function TopicController(topicService, topicList, securityService) {
        var vm = this;

        //Instancia variáveis que irão receber os dados
        vm.dados = {};
        vm.topicList = topicList;
        vm.isAuthenticated = securityService.isAuthenticated;

        //Referencia os metodos disponíveis
        vm.save = save;


        //******************************
        //Abaixo métodos do controle
        //******************************

        function save(topic) {
            topicService.salvar(topic).then(success, error);

            function success(sucess) {
                console.log("salvo com sucesso");
            }

            function error(error) {
                console.log("erro:" + error);
            }
        }
        
    }
})();