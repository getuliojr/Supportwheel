describe('Component: chooseLanguage', function () {

    //Variable for itens that are going to be used in the tests
    var $controller, $compile, directive;

    //Load Module to be Tested
    beforeEach(module('components.core.chooseLanguage', 'templates'));

    //Load Services
    beforeEach(module('shared.services.service', 'ngStorage', 'ngMaterial', 'pascalprecht.translate'));

    //Inject Dependencies
    beforeEach(inject(function (_$rootScope_, _$controller_, _$localStorage_) {

        //Create new scope
        scope = _$rootScope_.$new();
        $controller = _$controller_;

        //Clear Storage before every test
        _$localStorage_.$reset();
    }));

    describe('Directive', function () {

        //Inject dependencies for the directive
        beforeEach(inject(function (_$compile_) {
            $compile = _$compile_;
            directive = getCompiledElement();
        }));


        it("expect template to be created", function () {

            expect(directive.html()).not.toEqual('');
            //Only one button is generated in the screen, the others are hidden in the dom 
            //It just appears after click
            var chooseLanguageButton = directive.find('md-menu').children('button');
            expect(chooseLanguageButton.length).toEqual(1);
        });
    });

    describe('Controller', function () {
        it("expect chooseLanguage controller to be initialized", function () {

            //Create controller
            var controller = $controller('ChooseLanguageController', { $scope: scope });
            scope.vm = controller;
            expect(controller).toBeDefined();

        });

        it("expect changeLanguage to be working", function () {

            //Create controller
            var controller = $controller('ChooseLanguageController', { $scope: scope });
            scope.vm = controller;
            expect(scope.vm.getName()).toBeUndefined();

            //Change language to English
            scope.vm.changeLanguage("en-US");
            scope.$digest();
            expect(scope.vm.getName()).toBe("English");

        });

        it("expect getName to be Undefined if set with an unknown language", function () {

            //Create controller
            var controller = $controller('ChooseLanguageController', { $scope: scope });
            scope.vm = controller;

            //Change language to English
            scope.vm.changeLanguage("en-US");
            scope.$digest();
            expect(scope.vm.getName()).toBe("English");

            //Se to an unkown language
            scope.vm.changeLanguage("xx");
            scope.$digest();
            expect(scope.vm.getName()).toBeUndefined();

        });
    });


    //Helper Function
    function getCompiledElement() {
        var element = angular.element('<body><choose-language/><body>');
        var compiledElement = $compile(element)(scope);
        scope.$digest();
        return compiledElement;
    }

});