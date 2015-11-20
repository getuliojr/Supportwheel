describe('ManterTopicController', function () {

    //Variáveis globais de teste
    var $controller,
        mockHandleExceptionFactory,
        handleExceptionFactory,
        MockHttpFactory,
        mockTopicDB,
        topic,
        $httpBackend,
        securityService;

    //Carrega módulos padrões
    beforeEach(module('modules.common.services', 'ngResource', 'ngStorage', 'ui.router', 'ngMaterial'));

    //Permite verificar se o modulo handleExceptionFactory foi chamado 
    beforeEach(module('modules.topic', function ($provide) {
        $provide.decorator('handleExceptionFactory', function ($delegate) {
            mockHandleExceptionFactory = jasmine.createSpy('handleExceptionFactory', $delegate).and.callThrough();
            return mockHandleExceptionFactory;
        });
    }));

    //Injeta dependencias
    beforeEach(inject(function (_$rootScope_, _$controller_, _$state_, _$httpBackend_, _MockHttpFactory_,
        _handleExceptionFactory_, _securityService_) {
        topic = { intIdTopic: 1, strTitle: 'Topic1', txtDescription: 'Description1', intQtdComments: 0, intIdUserCreated: 2, strFullNameCreated: "Richard", "dteCreated": "2015-11-13T17:31:19.37" },
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
        securityService = _securityService_;
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('expect ManterTopicController to be initialized with its dependencies', function () {

        //Instancia o controller e insere no scope
        var ManterTopicController = $controller('ManterTopicController', {
            $scope: scope,
            topic: topic
        });
        scope.vm = ManterTopicController;

        expect(ManterTopicController).toBeDefined();
        
    });

    it("should give an error an trying to update without a surrogate key", function () {

        //All Required fields without surrogate Key
        var myTopic = { strTitle: 'MyTitleUpdated', strDescription: 'MyDescriptionUpdated' };

        //Instancia o controller e insere no scope
        var ManterTopicController = $controller('ManterTopicController', {
            $scope: scope,
            topic: topic
        });
        scope.vm = ManterTopicController;

        //save data, expect an error, since there is no surrogate key
        scope.vm.save(myTopic);
        scope.$digest();
        expect(handleExceptionFactory).toHaveBeenCalled();
    });

    it("should update the topic when all required fields are present", function () {
        spyOn($state, 'go');

        //All Required fields without surrogate Key
        var idTopic = 2;
        var myTopic = { intIdTopic: idTopic, strTitle: 'MyTitleUpdated', txtDescription: 'MyDescriptionUpdated' };

        //Instancia o controller e insere no scope
        var ManterTopicController = $controller('ManterTopicController', {
            $scope: scope,
            topic: topic
        });
        scope.vm = ManterTopicController;

        //Check values before the update
        expect(mockTopicDB.getData({ intIdTopic: idTopic }).strTitle).toBe("Topic2");
        expect(mockTopicDB.getData({ intIdTopic: idTopic }).txtDescription).toBe("Description2");

        //update data in the server
        scope.vm.save(myTopic);
        $httpBackend.flush();
        scope.$digest();

        //Check new values
        expect(mockTopicDB.getData({ intIdTopic: idTopic }).strTitle).toBe(myTopic.strTitle);
        expect(mockTopicDB.getData({ intIdTopic: idTopic }).txtDescription).toBe(myTopic.txtDescription);
        expect($state.go).toHaveBeenCalled(); //Page reloaded
    });

    it("should give an error trying to delete a topic without an key", function () {

        //Instancia o controller e insere no scope
        var ManterTopicController = $controller('ManterTopicController', {
            $scope: scope,
            topic: topic
        });
        scope.vm = ManterTopicController;

        //The mock database should already have 3 records
        expect(mockTopicDB.getData().length).toBe(3);

        //delete a topic without giving an key
        scope.vm.deleteTopic(); 
        scope.$digest();

        //Expect to still have  3 records on Database
        expect(mockTopicDB.getData().length).toBe(3);

        //Espera ter caido em exceção
        expect(handleExceptionFactory).toHaveBeenCalled();
    });

    it("should delete a topic and redirect", function () {
        spyOn($state, 'go');

        //Instancia o controller e insere no scope
        var ManterTopicController = $controller('ManterTopicController', {
            $scope: scope,
            topic: topic
        });
        scope.vm = ManterTopicController;
        var myTopicID = 2;

        //The mock database should already have 3 records
        expect(mockTopicDB.getData().length).toBe(3);
        expect(mockTopicDB.getData({ intIdTopic: myTopicID }).strTitle).toBeDefined();


        //delete a topic passing a key
        scope.vm.deleteTopic(myTopicID);
        $httpBackend.flush();
        scope.$digest();

        //Expect to  have 2 records on Database
        expect(mockTopicDB.getData().length).toBe(2);
        expect(mockTopicDB.getData({ intIdTopic: myTopicID })).toBeUndefined();
        expect($state.go).toHaveBeenCalledWith('topic.list');
    });

    it("should be validating correct the user who created the Topic", function () {

        spyOn(securityService, 'currentUser').and.returnValue(5);

        //Instancia o controller e insere no scope
        var ManterTopicController = $controller('ManterTopicController', {
            $scope: scope,
            topic: topic
        });
        scope.vm = ManterTopicController;

        expect(scope.vm.userCreatedTopic(4)).toBeFalsy;
        expect(scope.vm.userCreatedTopic(5)).toBeTruthy;
           
    });
   
});