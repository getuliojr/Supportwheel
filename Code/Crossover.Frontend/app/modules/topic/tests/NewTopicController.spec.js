describe('ListTopic Controller', function () {

    //Variáveis globais de teste
    var $controller, 
        topicService,
        notificationService,
        handleExceptionFactory,
        MockHttpBackendService,
        mockTopicService;

    //Carrega módulos padrões
    beforeEach(module('modules.common.services', 'ngResource', 'ui.router'));

    //Carrega módulos a serem testados
    beforeEach(module('modules.topic'));

    //Injeta dependencias
    beforeEach(inject(function (_$controller_,  _notificationService_, _handleExceptionFactory_, _$state_, _topicService_,) {

        mockTopicData = [
            { intIdTopic: 1, strTitle: 'Topic1', txtDescription: 'Description1', intQtdComments: 0, intIdUserCreated: 2, strFullNameCreated: "Richard", "dteCreated":"2015-11-13T17:31:19.37" },
            { intIdTopic: 2, strTitle: 'Topic2', txtDescription: 'Description2', intQtdComments: 20, intIdUserCreated: 1, strFullNameCreate: "Getulio", "dteCreated":"2015-11-13T17:31:19.37" },
            { intIdTopic: 3, strTitle: 'Topic3', txtDescription: 'Description3', intQtdComments: 15, intIdUserCreated: 2, strFullNameCreated: "Richard", "dteCreated":"2015-11-13T17:31:19.37" }
        ];

        //Mock do backend
        $httpBackend = _$httpBackend_;
        MockHttpBackendService = _MockHttpBackendService_;
        mockTopicService = MockHttpBackendService('topic', 'intIdTopic', mockTopicData);

        //Cria um novo escopo
        scope = _$rootScope_.$new();
        $controller = _$controller_;
        notificationService = _notificationService_;
        handleExceptionFactory = _handleExceptionFactory_;
        $state = _$state_;
        topicService = _topicService_;

    }));

    it('expect NewTopicController to be initialized', function () {

        //Instancia o controller e insere no scope
        var NewTopicController = $controller('NewTopicController', {
            $scope: scope
        });
        scope.vm = NewTopicController;

        expect(NewTopicController).toBeDefined();
        
    });

    it("should validade the required field 'strTitle' on saving", function () {

        spyOn(handleExceptionFactory);

        //Instancia o controller e insere no scope
        var NewTopicController = $controller('NewTopicController', { $scope: scope });
        scope.vm = NewTopicController;

        var myTopic = { txtDescription: 'myDescription' };


        //The mock database should already have 3 records
        expect(mockTopicService.getData().length).toBe(3);

        //Try to save a record with incomplete information, no strTitle
        scope.vm.save(myTopic);
        $httpBackend.flush();
        scope.$digest();

        //Expect to still have only 3 records on Database
        expect(mockTopicService.getData().length).toBe(3);

        //Espera ter caido em exceção
        expect(handleExceptionFactory).toHaveBeenCalled();
    });

    it("should validade the required field 'txtDescription' on saving", function () {

        spyOn(handleExceptionFactory);

        var myTopic = { strTitle: 'myTitle' };
        var NewTopicController = $controller('NewTopicController', { $scope: scope });
        scope.vm = NewTopicController;

        //The mock database should already have 3 records
        expect(mockTopicService.getData().length).toBe(3);

        //Try to save a record with incomplete information, no strTitle
        scope.vm.save(myTopic);
        $httpBackend.flush();
        scope.$digest();

        //Espera ainda ter 3 registro na base
        expect(mockTopicService.getData().length).toBe(3);

        //Espera ter caido em exceção
        expect(handleExceptionFactory).toHaveBeenCalled();
    });

    it("should create a new topic and redirect", function () {

        spyOn($state, 'go');
        spyOn(handleExceptionFactory);

        //All required fields (only)
        var myTopic = { strTitle: 'myTitle', txtDescription: 'MyDescription' };

        //Instancia o controller e insere no scope
        var NewTopicController = $controller('NewTopicController', { $scope: scope });
        scope.vm = NewTopicController;

        //Espera 3 tres registros no banco
        expect(mockTopicService.getData().length).toBe(3);

        //Salva o registro
        scope.vm.salvarSample(myTopic);
        $httpBackend.flush();
        scope.$digest();

        //Espera ter 4 registros
        expect(mockTopicService.getData().length).toBe(4);
        //Espera não ter tido exceção
        expect(handleExceptionFactory).not.toHaveBeenCalled();
        //Espera ter sido redirecionado para o id criado
        expect($state.go).toHaveBeenCalledWith('topic.view.index');
        
    });
   
});