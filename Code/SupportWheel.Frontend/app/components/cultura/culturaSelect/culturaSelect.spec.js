describe('Component.cultura: culturaSelect', function () {

    //Variable for itens that are going to be used in the tests
    var $compile, directive, controllerAs, componentName, componentElement, isolateScope;

    //Load Module to be Tested
    beforeEach(module('components.cultura.culturaSelect', 'templates'));

    //Load Services
    beforeEach(module('shared.services.service', 'ngStorage', 'ngMaterial', 'pascalprecht.translate'));

    //Inject Dependencies
    beforeEach(inject(function (_$rootScope_, _$controller_, _$compile_, _$componentController_) {

        //Create new scope
        scope = _$rootScope_.$new();
        //Configure to always start as an empty config
        scope.config = {}; 

        //Inject dependencies
        $compile = _$compile_;

        //Create Directive
        var element = '<abc-cultura-select id="id" required="required"></abc-cultura-select>';
        componentElement = getCompiledElement(element);

        //Other variables
        componentName = 'abcCulturaSelect';
        isolateScope = componentElement.isolateScope();
        $componentController = _$componentController_;


    }));


    it('expect template to be replaced', function () {
        expect(componentElement.find('md-autocomplete').length).toBe(1);
    });

    it('expect controller to be defined', function () {
        var controller = componentElement.controller(componentName);
        expect(controller).toBeDefined();
    });

    it('expect controller to be initialized', function () {
        var controller = componentElement.controller(componentName);
        expect(controller.culturas.length).toBe(4);
    });

    it('expect controller to be attached to the scope as $ctrl', function () {
        controller = $componentController(componentName, { $scope: scope });
        //Check if $ctrl has been set with the controller
        expect(scope.$ctrl).toBe(controller);
    });

    it('expect parameter: "id" to be set', function () {
        //Run digest, setting new values in outer scope
        controller = componentElement.controller(componentName);
        
        expect(controller.id).toBeUndefined(); 
        scope.id = "pt-br";
        scope.$digest();
        expect(controller.id).toBe(scope.id);

        scope.id = undefined;
        scope.$digest();
        expect(controller.id).toBeUndefined();

    });

    it('expect parameter: "required" to be set', function () {
        //Run digest, setting new values in outer scope
        controller = componentElement.controller(componentName);

        expect(controller.required).toBeUndefined();
        scope.required = true;
        scope.$digest();
        expect(controller.required).toBe(scope.required);

        scope.required = undefined;
        scope.$digest();
        expect(controller.required).toBeUndefined();

    });

    it('expect parameter: "id" to configure selected value in the list', function () {
        controller = componentElement.controller(componentName);
        scope.id = "pt-BR";
        scope.$digest();
        expect(controller.searchText).toBe('CULTURA.PORTUGUES');

        scope.id = "en-US";
        scope.$digest();
        expect(controller.searchText).toBe('CULTURA.INGLES');

    });

    //Helper Function
    function getCompiledElement(el){
        var element = angular.element("<body>" + el + "</body");
        var compiledElement = $compile(element)(scope);     
        scope.$digest();       
        return compiledElement;
    }

});
