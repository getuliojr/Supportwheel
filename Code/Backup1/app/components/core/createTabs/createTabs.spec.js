describe('Component.Core: createTabs', function () {

    //Variable for itens that are going to be used in the tests
    var $compile, directive, controllerAs, directiveName, isolateScope;

    //Load Module to be Tested
    beforeEach(module('components.core.createTabs', 'templates'));

    //Load Services
    beforeEach(module('shared.services.service', 'ngStorage', 'ngMaterial', 'ui.router', 'pascalprecht.translate'));

    //Inject Dependencies
    beforeEach(inject(function (_$rootScope_, _$controller_, _$compile_) {

        //Create new scope
        scope = _$rootScope_.$new();

        //Inject dependencies
        $compile = _$compile_;

        //Create Directive
        var directiveElement = '<create-tabs title="title" tabs="tabs"></create-tabs>';
        directive = getCompiledElement(directiveElement);
        
        //Other variables
        controllerAs = 'createTabs';
        directiveName = 'createTabs';
        isolateScope = directive.isolateScope();
        

    }));


    it('expect template to be replaced', function () {
        expect(directive.find('md-card').length).toBe(1);       
    });

    it('expect controller to be defined', function () {
        var controller = directive.controller(directiveName);
        expect(controller).toBeDefined();
    });

    it('expect controllerAs name to be right', function () {
        expect(isolateScope.hasOwnProperty(controllerAs)).toBeTruthy();
    });

    it('expect parameter: "title" to be set', function () {
        var tabTitle = "Tab Title";
        scope.title = tabTitle;
        var controller = isolateScope[controllerAs];
        

        //isolateScope in the controller shouldn´t have a value yet
        expect(controller.title).toBeUndefined();

        //Run digest, setting new values in outer scope
        scope.$digest();

        //isolateScope in controller must be set
        expect(controller.title).toBe(tabTitle);

    });

    it('expect directive to render a title', function () {
        var tabTitle = "Tab Title";
        scope.title = tabTitle;

        //Run digest, setting new values in outer scope
        scope.$digest();
        expect(directive.children('md-card').children('md-toolbar').children('div').children('span').html()).toBe(tabTitle);

    });
    
    it('expect parameter: "tabsList" to be set', function () {
        var tabs = [
            { tabName: "TabName1", tabIcon: "tabIcon1", tabViewName : "tabViewName1", tabState: "tabState1", disabled: false},
            { tabName: "TabName2", tabIcon: "tabIcon2", tabViewName : "tabViewName2", tabState: "tabState2", disabled: false}
        ];
        scope.tabs = tabs;

        var controller = isolateScope[controllerAs];
        
        //isolateScope in the controller shouldn´t have a value yet
        expect(controller.tabs).toBeUndefined();

        //Run digest, setting new values in outer scope
        scope.$digest();

        //Values should have been set
        expect(controller.tabs).toBeDefined();
        expect(controller.tabs.length).toBe(2);
    });

    it('expect directive to render right number of tabs', function () {
        var tabs = [
            { tabName: "TabName1", tabIcon: "tabIcon1", tabViewName: "tabViewName1", tabState: "tabState1" },
            { tabName: "TabName2", tabIcon: "tabIcon2", tabViewName: "tabViewName2", tabState: "tabState2" }
        ];
        scope.tabs = tabs;

        //Run digest, setting new values in outer scope
        scope.$digest();

        //Should have two tabs
        expect(directive.find('md-tab').length).toBe(2);
        
        //Should have three tabs
        tabs.push({ tabName: "TabName3", tabIcon: "tabIcon3", tabViewName: "tabViewName3", tabState: "tabState3" });
        scope.$digest();

        expect(directive.find('md-tab').length).toBe(3);

    });

    it('expect template to have the right properties name/values', function () {
        var tabs = [
            { tabName: "TabName1", tabIcon: "tabIcon1", tabViewName: "tabViewName1", tabUrl: "/state1" },
            { tabName: "TabName2", tabIcon: "tabIcon2", tabViewName: "tabViewName2", tabUrl: "/state2" }
        ];
        scope.tabs = tabs;

        //Run digest, setting new values in outer scope
        scope.$digest();

        //Check if all properties are set right in the template
        expect(directive.find('md-icon').eq(0).text()).toBe(tabs[0].tabIcon);
        expect(directive.find('md-label').eq(0).text()).toBe(tabs[0].tabName);
        expect(directive.find('md-content').eq(0).attr('ui-view')).toBe(tabs[0].tabViewName);

    });

    //Helper Function
    function getCompiledElement(el){
        var element = angular.element("<body>" + el + "</body");
        var compiledElement = $compile(element)(scope);     
        scope.$digest();       
        return compiledElement;
    }

});