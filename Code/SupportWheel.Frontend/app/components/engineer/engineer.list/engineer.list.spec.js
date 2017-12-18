describe('Component.Instituicao: instituicaoSearch', function () {

    //Variable for itens that are going to be used in the tests
    var $compile, directive, componentName, componentElement, isolateScope;

    //Load Module to be Tested
    beforeEach(module('components.instituicao.instituicao.search', 'templates'));

    //Load Services
    beforeEach(module('shared.services.service', 'ngStorage', 'ngMaterial', 'pascalprecht.translate'));

    //Load factories (resource, backend)
    beforeEach(module('shared.services.factory', 'ngResource', 'SignalR'));

    //Inject Dependencies
    beforeEach(inject(function (_$rootScope_, _$controller_, _$compile_, _$componentController_) {

        //Create new scope
        scope = _$rootScope_.$new();
        //Configure to always start as an empty config
        scope.config = {}; 

        //Inject dependencies
        $compile = _$compile_;

        //Create Directive
        var element = '<abc-instituicao-search></abc-instituicao-search>';
        componentElement = getCompiledElement(element);

        //Other variables
        componentName = 'abcInstituicaoSearch';
        isolateScope = componentElement.isolateScope();
        $componentController = _$componentController_;
        

    }));


    it('expect template to be replaced', function () {
        expect(componentElement.find('form').length).toBe(1);
    });

    it('expect controller to be defined', function () {
        var controller = componentElement.controller(componentName);
        expect(controller).toBeDefined();
    });

    it('expect controller to be attached to the scope as $ctrl', function () {
        controller = $componentController(componentName, { $scope: scope });
        //Check if $ctrl has been set with the controller
        expect(scope.$ctrl).toBe(controller);
    });


    //Helper Function
    function getCompiledElement(el){
        var element = angular.element("<body>" + el + "</body");
        var compiledElement = $compile(element)(scope);
        scope.$digest();
        return compiledElement;
    }

});