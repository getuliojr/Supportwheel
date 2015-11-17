(function () {

    'use strict';

    //Configura as rotas do módulo sample
    angular.module('CrossoverApp').config(novasRotas);


    //Injeta as dependências do modulo para funcionar corretamente quando rodar tarefa de minify
    novasRotas.$inject = ['$stateProvider'];

    //Define rotas
    function novasRotas($stateProvider) {

        var resolve = {};

        //function lists
        resolve.loadTopicList = loadTopicList;                  //Load All Topics 
        resolve.loadCurrentTopic = loadCurrentTopic;            //Load Current Topic

        $stateProvider
            .state('topic', {
                abstract: true,
                url: '',
                template: '<ui-view/>',
            })
            .state('topic.list', {
                url: '/',
                templateUrl: 'app/modules/topic/views/listTopics.html',
                controller: 'ListTopicController as topic',
                resolve: {
                    topicList: resolve.loadTopicList
                }
            })
            .state('topic.new', {
                url: '/topic',
                templateUrl: 'app/modules/topic/views/formTopic.html',
                controller: 'NewTopicController as topic',
                requireAuthenticatedUser: true
            })
            .state('topic.view', {
                url: '/topic/{intIdTopic:[0-9]*}',
                templateUrl: 'app/modules/topic/views/viewTopic.html',
                controller: 'ManterTopicController as topic',
                requireAuthenticatedUser: true,
                resolve: {
                    topic: resolve.loadCurrentTopic
                }
            })
            .state('topic.view.edit', {
                url: '/edit',
                templateUrl: 'app/modules/topic/views/formTopic.html',
                controller: 'ManterTopicController as topic',
                requireAuthenticatedUser: true
            })
            ;

    }


    //Resolve Dependencies
    loadTopicList.$inject = ['topicService'];
    loadCurrentTopic.$inject = ['$stateParams', 'topicService']

    //Functions in route resolves
    function loadTopicList (topicService) {
        return topicService.carregar();
    }

    function loadCurrentTopic($stateParams, topicService) {
        var intIdTopic = $stateParams.intIdTopic;
        return topicService.carregar({ intIdTopic: intIdTopic });
    }
    
})();