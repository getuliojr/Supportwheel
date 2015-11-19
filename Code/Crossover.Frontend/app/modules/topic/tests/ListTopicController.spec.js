describe('ListTopic Controller', function () {

    //Variáveis globais de teste
    var $controller, 
        securityService,
        mockTopicData

    //Carrega módulos padrões
    beforeEach(module('modules.common.services'));

    //SecurityService Dependencies
    beforeEach(module('ngStorage', 'ngResource', 'ngMaterial'));

    //Carrega módulos a serem testados
    beforeEach(module('modules.topic'));

    //Injeta dependencias
    beforeEach(inject(function (_$rootScope_, _$controller_,  _securityService_) {

        mockTopicData = [
            { intIdTopic: 1, strTitle: 'Topic1', txtDescription: 'Description1', intQtdComments: 0, intIdUserCreated: 2, strFullNameCreated: "Richard", "dteCreated":"2015-11-13T17:31:19.37" },
            { intIdTopic: 2, strTitle: 'Topic2', txtDescription: 'Description2', intQtdComments: 20, intIdUserCreated: 1, strFullNameCreate: "Getulio", "dteCreated":"2015-11-13T17:31:19.37" },
            { intIdTopic: 3, strTitle: 'Topic3', txtDescription: 'Description3', intQtdComments: 15, intIdUserCreated: 2, strFullNameCreated: "Richard", "dteCreated":"2015-11-13T17:31:19.37" }
        ];

        //Cria um novo escopo
        scope = _$rootScope_.$new();

        securityService = _securityService_;
        $controller = _$controller_;

        spyOn(securityService, 'isAuthenticated').and.returnValue(false);
    }));

    it('expect controller to be initialized', function () {

        //Instancia o controller e insere no scope
        var ListTopicController = $controller('ListTopicController', {
            $scope: scope,
            topicList: mockTopicData
        });
        scope.vm = ListTopicController;

        expect(ListTopicController).toBeDefined();
        
    });

    it("should retrieve the topics list", function () {

        //Instancia o controller e insere no scope
        var ListTopicController = $controller('ListTopicController', {
            $scope: scope,
            topicList: mockTopicData
        });
        scope.vm = ListTopicController;

        expect(scope.vm.topicList.length).toBe(3); //mockdata has 3 records
    });

    it("function isAuthenticated should be defined", function () {
        
        //Instancia o controller e insere no scope
        var ListTopicController = $controller('ListTopicController', {
            $scope: scope,
            topicList: mockTopicData
        });
        scope.vm = ListTopicController;

        expect(scope.vm.isAuthenticated).toBeDefined();
        expect(scope.vm.isAuthenticated()).toBeFalsy();
    });
   
});