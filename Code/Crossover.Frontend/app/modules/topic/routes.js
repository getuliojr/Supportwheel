(function () {

    'use strict';

    //Configura as rotas do módulo sample
    angular.module('CrossoverApp').config(novasRotas);


    //Injeta as dependências do modulo para funcionar corretamente quando rodar tarefa de minify
    novasRotas.$inject = ['$stateProvider'];

    //Define rotas
    function novasRotas($stateProvider) {

        $stateProvider
            .state('listTopics', {
                url: '/',
                templateUrl: 'app/modules/topic/views/listTopics.html',
                controller: 'TopicController as topic',
                resolve: {
                    topicService: 'topicService',
                    topicList: function (topicService) {
                        return topicService.carregar();
                    }
                }
            })
            .state('newTopic', {
                url: '/topic',
                templateUrl: 'app/modules/topic/views/newTopic.html',
                controller: 'TopicController as topic',
                requireAuthenticatedUser: true,
                resolve: {
                    topicService: 'topicService',
                    topicList: function (topicService) {
                        return topicService.carregar();
                    }
                }
            });
            
            


    }
    
})();