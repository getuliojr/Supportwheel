describe('NewCommentController', function () {

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
    beforeEach(module('modules.comment', function ($provide) {
        $provide.decorator('handleExceptionFactory', function ($delegate) {
            mockHandleExceptionFactory = jasmine.createSpy('handleExceptionFactory', $delegate).and.callThrough();
            return mockHandleExceptionFactory;
        });
    }));

    //Injeta dependencias
    beforeEach(inject(function (_$rootScope_, _$controller_, _$state_, _$httpBackend_, _MockHttpFactory_, _handleExceptionFactory_) {

        mockData = [
            { intIdComment: 1, IntIdTopic: 1, txtComment: 'Comment1', intIdUserCreated: 2, strFullNameCreated: "Richard", "dteCreated": "2015-11-13T17:31:19.37" },
            { intIdComment: 2, IntIdTopic: 2, txtComment: 'Comment2', intIdUserCreated: 1, strFullNameCreate: "Getulio", "dteCreated": "2015-11-13T17:31:19.37" },
            { intIdComment: 3, IntIdTopic: 3, txtComment: 'Comment3', intIdUserCreated: 2, strFullNameCreated: "Richard", "dteCreated": "2015-11-13T17:31:19.37" }
        ];

        //Mock do backend
        $httpBackend = _$httpBackend_;
        MockHttpFactory = _MockHttpFactory_;
        mockCommentDB = MockHttpFactory('comment', 'intIdComment', mockData);
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

    it("expect NewCommentController to be initialized", function () {

        //Instancia o controller e insere no scope
        var NewCommentController = $controller('NewCommentController', { $scope: scope });
        scope.vm = NewCommentController;

        expect(NewCommentController).toBeDefined();
        
    });

    it("should validate the required fields 'intIdTopic' and 'txtDescription' on the reply function", function () {

        //Instancia o controller e insere no scope
        var NewCommentController = $controller('NewCommentController', { $scope: scope });
        scope.vm = NewCommentController;

        var myComment = { txtDescription: 'myDescription' };
        

        //The mock database should already have 3 records
        expect(mockCommentDB.getData().length).toBe(3);

        //Try to save a record with incomplete information, no intIdTopic
        scope.vm.reply(myComment, null); //Since will be an validation error, so the backend is never called
        scope.$digest();

        //Expect to still have only 3 records on Database
        expect(mockCommentDB.getData().length).toBe(3);

        //Espera ter caido em exceção
        expect(handleExceptionFactory).toHaveBeenCalled();


        //Try to save a record with incomplete information, no txtDescription
        scope.vm.reply({}, 7); //Since will be an validation error, so the backend is never called
        scope.$digest();

        //Expect to still have only 3 records on Database
        expect(mockCommentDB.getData().length).toBe(3);

        //Espera ter caido em exceção
        expect(handleExceptionFactory).toHaveBeenCalled();

    });

    xit("should add a new comment and redirect", function () {

        spyOn($state, 'go');

        //All required fields (only)
        var myComment = { intIdTopic: 5, txtDescription: 'myDescription' };

        //Instancia o controller e insere no scope
        var NewCommentController = $controller('NewCommentController', { $scope: scope });
        scope.vm = NewCommentController;

        //Espera 3 tres registros no banco
        expect(mockCommentDB.getData().length).toBe(3);

        //Salva o registro
        scope.vm.reply(myComment, 5);
        $httpBackend.flush();
        scope.$digest();

        //Espera ter 4 registros
        expect(mockCommentDB.getData().length).toBe(4);

        //Espera ter sido redirecionado para o id criado
        expect($state.go).toHaveBeenCalledWith('topic.view.index', { intIdTopic: 5 }, { reload: true });
        
    });
   
});