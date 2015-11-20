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
                controller: false,
                template: '<ui-view/>',
            })
            .state('topic.list', {
                url: '/',
                templateUrl: 'app/modules/topic/views/listTopics.html',
                controller: 'ListTopicController',
                controllerAs: 'listTopic',
                resolve: {
                    topicList: resolve.loadTopicList
                }
            })
            .state('topic.new', {
                url: '/topic',
                templateUrl: 'app/modules/topic/views/formTopic.html',
                controller: 'NewTopicController',
                controllerAs: 'topic',
                requireAuthenticatedUser: true
            })
            .state('topic.view', {
                abstract: true,
                url: '/topic/{intIdTopic:[0-9]*}',
                template: '<ui-view/>',
                controller: 'ManterTopicController',
                controllerAs: 'topic',
                resolve: {
                    topic: resolve.loadCurrentTopic
                }
            })
            .state('topic.view.index', {
                url: '',
                templateUrl: 'app/modules/topic/views/viewTopic.html',
                requireAuthenticatedUser: true,
               
            })
            
            .state('topic.view.edit', {
                url: '/edit',
                templateUrl: 'app/modules/topic/views/formTopic.html',
                requireAuthenticatedUser: true
            })
            ;

    }


    //Resolve Dependencies
    loadTopicList.$inject = ['topicService', 'handleExceptionFactory'];
    loadCurrentTopic.$inject = ['$stateParams', 'topicService', 'handleExceptionFactory','$q', '$state']

    //Functions in route resolves
    function loadTopicList (topicService, handleExceptionFactory) {
        return topicService.carregar()
            .catch(handleExceptionFactory);
    }

    function loadCurrentTopic($stateParams, topicService, handleExceptionFactory, $q, $state) {
         var intIdTopic = $stateParams.intIdTopic;
         return topicService.carregar({ intIdTopic: intIdTopic })
            .then(function (data) {
                if (data.intIdTopic != undefined) {
                   return $q.resolve(data);
                } else {
                    $state.go('topic.list');
                   return $q.reject({type: 'error', message: 'This topic does not exist !'});
                }
            })
            .catch(handleExceptionFactory);
    }
    
})();