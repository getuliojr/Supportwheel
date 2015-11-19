describe('Testing Sample - Crud Examples', function () {

    //Variáveis globais de teste
    var $controller,
        $httpBackend,
        $location,
        excecaoService,
        MockHttpBackendService,
        mockNewSampleService;

    //Carrega módulos padrões
    beforeEach(module('modules.common.services', 'ngResource', 'ui.router'));

    //Carrega módulos a serem testados
    beforeEach(module('modules.sample'));

    //Injeta dependencias
    beforeEach(inject(function (_$rootScope_, _$controller_, _$httpBackend_, _MockHttpBackendService_, _$location_, _excecaoService_) {

        var sampleSeedData = [
            { sample_id: 1, nome: 'SampleTest1', telefone: '1111-1111', data: null },
            { sample_id: 2, nome: 'SampleTest2', telefone: '2222-2222', data: '2015-02-01T00:00:00' },
            { sample_id: 3, nome: 'SampleTest3', telefone: '3333-3333', data: '2015-02-02T00:00:00' }
        ];

        //Cria um novo escopo
        scope = _$rootScope_.$new();

        //Mock do backend
        $httpBackend = _$httpBackend_;

        //Responsável por gerar mocks para o backend
        MockHttpBackendService = _MockHttpBackendService_;
        mockNewSampleService = MockHttpBackendService('newsamples', 'sample_id', sampleSeedData);

        $location = _$location_;
        excecaoService = _excecaoService_;

        $controller = _$controller_;
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('expect controller to be initialized', function () {

        //Instancia o controller e insere no scope
        var sampleController = $controller('SampleController', { $scope: scope });
        scope.vm = sampleController;

        expect(sampleController).toBeDefined();
        $httpBackend.flush();
    });

    it("should retrieve the samples list", function () {

        //Instancia o controller e insere no scope
        var sampleController = $controller('SampleController', { $scope: scope });
        scope.vm = sampleController;

        expect(scope.vm.dados.samplesList.length).toBe(0);
        $httpBackend.flush();
        expect(scope.vm.dados.samplesList.length).toBe(3);
    });

    it("should validade the required field 'nome' on saving", function () {

        spyOn(excecaoService, 'tratarErro');

        //Instancia o controller e insere no scope
        var sampleController = $controller('SampleController', { $scope: scope });
        scope.vm = sampleController;

        var mySample = { telefone: '1234-5678', data: '2015-02-13' };


        //Espera 3 tres registros no banco
        expect(mockNewSampleService.getData().length).toBe(3);

        //Pede para salvar o registro com dados incompletos
        scope.vm.salvarSample(mySample);
        $httpBackend.flush();
        scope.$digest();

        //Espera ainda ter 3 registro na base
        expect(mockNewSampleService.getData().length).toBe(3);

        //Espera ter caido em exceção
        expect(excecaoService.tratarErro).toHaveBeenCalled();
    });

    it("should validade the required field 'telefone' on saving", function () {

        spyOn(excecaoService, 'tratarErro');

        var mySample = { nome: 'Incomplete Record', data: '2015-02-13' };
        var sampleController = $controller('SampleController', { $scope: scope });
        scope.vm = sampleController;

        //Espera 3 tres registros no banco
        expect(mockNewSampleService.getData().length).toBe(3);

        //Pede para salvar o registro com dados incompletos
        scope.vm.salvarSample(mySample);
        $httpBackend.flush();
        scope.$digest();

        //Espera ainda ter 3 registro na base
        expect(mockNewSampleService.getData().length).toBe(3);

        //Espera ter caido em exceção
        expect(excecaoService.tratarErro).toHaveBeenCalled();
    });

    it("should create a new sample and redirect", function () {

        spyOn($location, 'path');
        spyOn(excecaoService, 'tratarErro');

        //Campos obrigatórios apenas
        var mySample = { nome: "SampleTestInsert", telefone: "5555-5555" }

        //Instancia o controller e insere no scope
        var sampleController = $controller('SampleController', { $scope: scope });
        scope.vm = sampleController;

        //Espera 3 tres registros no banco
        expect(mockNewSampleService.getData().length).toBe(3);

        //Salva o registro
        scope.vm.salvarSample(mySample);
        $httpBackend.flush();
        scope.$digest();

        //Espera ter 4 registros
        expect(mockNewSampleService.getData().length).toBe(4);
        //Espera não ter tido exceção
        expect(excecaoService.tratarErro).not.toHaveBeenCalled();
        //Espera ter sido redirecionado para o id criado
        expect($location.path).toHaveBeenCalledWith('/sample/' + mockNewSampleService.getData()[mockNewSampleService.getData().length - 1].sample_id);
        
    });

    it("should delete a sample from the list", function () {

        spyOn(excecaoService, 'tratarErro');

        //Campos obrigatórios apenas
        var mySampleId = 1;

        //Instancia o controller e insere no scope
        var sampleController = $controller('SampleController', { $scope: scope });
        scope.vm = sampleController;

        //Espera 3 tres registros no banco
        expect(mockNewSampleService.getData().length).toBe(3);

        //Apaga um registro
        scope.vm.removerSample(mySampleId);
        $httpBackend.flush();
        scope.$digest();

        //Espera ter 2 registros
        expect(mockNewSampleService.getData().length).toBe(2);
        //Espera não ter tido exceção
        expect(excecaoService.tratarErro).not.toHaveBeenCalled();

    });

    it("should load a sample when there is an Id in the url", function () {

        spyOn(excecaoService, 'tratarErro');

        //Campos obrigatórios apenas
        var mySampleId = 1;

        //Instancia o controller e insere no scope
        var sampleController = $controller('SampleController', {
            $scope: scope
            , $stateParams: { id: mySampleId }
        });
        scope.vm = sampleController;

        expect(scope.vm.dados.sample.sample_id).toBeUndefined();

        //Instancia o controle
        $httpBackend.flush();
        scope.$digest();

        expect(scope.vm.dados.sample.sample_id).toBe(mySampleId);
        //Espera não ter tido exceção
        expect(excecaoService.tratarErro).not.toHaveBeenCalled();

    });

    it("should give an error when loading a sample that is not found", function () {

        //spy tem que ser criado antes do controller;
        spyOn(excecaoService, 'tratarErro');

        //Campos obrigatórios apenas
        var mySampleId = 88;

        //Instancia o controller e insere no scope
        var sampleController = $controller('SampleController', {
            $scope: scope,
            $stateParams: { id: mySampleId }
        });
        scope.vm = sampleController;

        //Espera não ter dados antes do get
        expect(scope.vm.dados.sample.sample_id).toBeUndefined();

        //Instancia o controle
        $httpBackend.flush();
        scope.$digest();

        //Espera não ter dados 
        expect(scope.vm.dados.sample.sample_id).toBeUndefined();

        //Espera ter tido exceção
        expect(excecaoService.tratarErro).toHaveBeenCalled();

    });

    it("should update a sample", function () {
        //spy tem que ser criado antes do controller;
        spyOn(excecaoService, 'tratarErro');

        //Campos obrigatórios apenas
        var mySampleId = 1;
        var updateData = { sample_id: 1, nome: "atualizado", telefone: '1234-5678' };

        //Instancia o controller e insere no scope
        var sampleController = $controller('SampleController', {
            $scope: scope,
            $stateParams: { id: mySampleId }
        });
        scope.vm = sampleController;

        //Instancia o controle
        $httpBackend.flush();
        scope.$digest();

        //Verifica dados iniciais
        expect(scope.vm.dados.samplesList.length).toBe(3);
        expect(scope.vm.dados.samplesList[0].nome).toBe(mockNewSampleService.getData()[0].nome);
        expect(scope.vm.dados.samplesList[0].telefone).toBe(mockNewSampleService.getData()[0].telefone);

        //Pede para atualizar o item de ID: 1
        scope.vm.salvarSample(updateData);

        //Instancia o controle
        $httpBackend.flush();
        scope.$digest();

        //Verifica dados finais
        expect(scope.vm.dados.samplesList.length).toBe(3);
        expect(scope.vm.dados.samplesList[0].nome).toBe(updateData.nome);
        expect(scope.vm.dados.samplesList[0].telefone).toBe(updateData.telefone);

        //Espera não ter tido exceção
        expect(excecaoService.tratarErro).not.toHaveBeenCalled();

    });
});