describe('NewTopicController', function () {

    //Variáveis globais de teste
    var $controller, 
        mockHandleExceptionFactory,
        handleExceptionFactory,
        MockHttpFactory,
        mockTopicDB,
        $httpBackend;

    //Carrega módulos padrões
    beforeEach(module('modules.common.services', 'ngResource', 'ui.router'));

    //Permite verificar se o modulo handleExceptionFactory foi chamado
    beforeEach(module('modules.topic', function ($provide) {
        $provide.decorator('handleExceptionFactory', function ($delegate) {
            mockHandleExceptionFactory = jasmine.createSpy('handleExceptionFactory', $delegate).and.callThrough();
            return mockHandleExceptionFactory;
        });
    }));

    //Injeta dependencias
    beforeEach(inject(function (_$rootScope_, _$controller_, _$state_, _$httpBackend_, _MockHttpFactory_, _handleExceptionFactory_) {

        mockTopicData = [
            { intIdTopic: 1, strTitle: 'Topic1', txtDescription: 'Description1', intQtdComments: 0, intIdUserCreated: 2, strFullNameCreated: "Richard", "dteCreated":"2015-11-13T17:31:19.37" },
            { intIdTopic: 2, strTitle: 'Topic2', txtDescription: 'Description2', intQtdComments: 20, intIdUserCreated: 1, strFullNameCreate: "Getulio", "dteCreated":"2015-11-13T17:31:19.37" },
            { intIdTopic: 3, strTitle: 'Topic3', txtDescription: 'Description3', intQtdComments: 15, intIdUserCreated: 2, strFullNameCreated: "Richard", "dteCreated":"2015-11-13T17:31:19.37" }
        ];

        //Mock do backend
        $httpBackend = _$httpBackend_;
        MockHttpFactory = _MockHttpFactory_;
        mockTopicDB = MockHttpFactory('topic', 'intIdTopic', mockTopicData);
        handleExceptionFactory = _handleExceptionFactory_;
        //Cria um novo escopo
        scope = _$rootScope_.$new();
        $controller = _$controller_;
        $state = _$state_;
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('expect NewTopicController to be initialized', function () {

        //Instancia o controller e insere no scope
        var NewTopicController = $controller('NewTopicController', {
            $scope: scope
        });
        scope.vm = NewTopicController;

        expect(NewTopicController).toBeDefined();
        
    });

    it("should validate the required field 'strTitle' on saving", function () {

        //Instancia o controller e insere no scope
        var NewTopicController = $controller('NewTopicController', { $scope: scope });
        scope.vm = NewTopicController;

        var myTopic = { txtDescription: 'myDescription' };
        

        //The mock database should already have 3 records
        expect(mockTopicDB.getData().length).toBe(3);

        //Try to save a record with incomplete information, no strTitle
        scope.vm.save(myTopic); //Since will be an validation error, so the backend is never called
        scope.$digest();

        //Expect to still have only 3 records on Database
        expect(mockTopicDB.getData().length).toBe(3);

        //Espera ter caido em exceção
        expect(handleExceptionFactory).toHaveBeenCalled();
    });

    it("should validade the required field 'txtDescription' on saving", function () {

        //Instancia o controller e insere no scope
        var NewTopicController = $controller('NewTopicController', { $scope: scope });
        scope.vm = NewTopicController;

        var myTopic = { strTitle: 'myTitle' };


        //The mock database should already have 3 records
        expect(mockTopicDB.getData().length).toBe(3);

        //Try to save a record with incomplete information, no strTitle
        scope.vm.save(myTopic); //Since will be an validation error, so the backend is never called
        scope.$digest();

        //Expect to still have only 3 records on Database
        expect(mockTopicDB.getData().length).toBe(3);

        //Espera ter caido em exceção
        expect(handleExceptionFactory).toHaveBeenCalled();
    });

    it("should create a new topic and redirect", function () {

        spyOn($state, 'go');

        //All required fields (only)
        var myTopic = { strTitle: 'myTitle', txtDescription: 'MyDescription' };

        //Instancia o controller e insere no scope
        var NewTopicController = $controller('NewTopicController', { $scope: scope });
        scope.vm = NewTopicController;

        //Espera 3 tres registros no banco
        expect(mockTopicDB.getData().length).toBe(3);

        //Salva o registro
        scope.vm.save(myTopic);
        $httpBackend.flush();
        scope.$digest();

        //Espera ter 4 registros
        expect(mockTopicDB.getData().length).toBe(4);

        //Espera ter sido redirecionado para o id criado
        expect($state.go).toHaveBeenCalledWith('topic.view.index', { intIdTopic: mockTopicDB.lastServerAnswer().intIdTopic });
        
    });
   
});