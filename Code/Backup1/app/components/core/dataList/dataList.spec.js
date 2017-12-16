describe('Component.Core: dataList', function () {

    //Variable for itens that are going to be used in the tests
    var $compile, directive, controllerAs, directiveName, isolateScope;

    //Load Module to be Tested
    beforeEach(module('components.core.dataList', 'templates'));

    //Load Services
    beforeEach(module('shared.services.service', 'ngStorage', 'md.data.table', 'ngMaterial', 'pascalprecht.translate'));

    //Inject Dependencies
    beforeEach(inject(function (_$rootScope_, _$controller_, _$compile_) {

        //Create new scope
        scope = _$rootScope_.$new();
        //Configure to always start as an empty config
        scope.config = {}; 

        //Inject dependencies
        $compile = _$compile_;

        //Create Directive
        var directiveElement = '<abc-data-list config="config" data="data", selected="selected" order-field="orderField"></abc-data-list>';
        directive = getCompiledElement(directiveElement);
        
        //Other variables
        controllerAs = 'dataList';
        directiveName = 'abcDataList';
        isolateScope = directive.isolateScope();
        

    }));


    it('expect template to be replaced', function () {
        expect(directive.find('md-table-container').length).toBe(1);
    });

    it('expect controller to be defined', function () {
        var controller = directive.controller(directiveName);
        expect(controller).toBeDefined();
    });

    it('expect controllerAs name to be right', function () {
        expect(isolateScope.hasOwnProperty(controllerAs)).toBeTruthy();
    });

    it('expect parameter: "config.title" to be set', function () {
        var config = { title: "List Title" };
        scope.config = config;
        var controller = isolateScope[controllerAs];
        
        //Shouldn´t have a value yet
        expect(controller.config.title).toBeUndefined();

        //Run digest, setting new values in outer scope
        scope.$digest();

        expect(controller.config.title).toBe(config.title);

    });

    it('expect component to render the title', function () {
        var config = { title: "List Title" };
        scope.config = config;

        //Run digest, setting new values in outer scope
        scope.$digest();
        expect(directive.find('h2').text()).toBe(config.title);

    });

    it('expect parameter: "config.enableFilter" to be set', function () {
        var config = { enableFilter: true };
        scope.config = config;
        var controller = isolateScope[controllerAs];


        //shouldn´t have a value yet
        expect(controller.config.enableFilter).toBeUndefined();

        //Run digest, setting new values in outer scope
        scope.$digest();
        
        //should have a value
        expect(controller.config.enableFilter).toBeDefined();
        expect(controller.config.enableFilter).toBe(true);

    });

    it('expect component to render the filter button based on enableFilter', function () {
        var config = { enableFilter: true };
        scope.config = config;

        //Run digest, setting new values in outer scope
        scope.$digest();

        expect(directive.find('md-icon').eq(0).text()).toBe('filter_list');

    });

    it('expect parameter: "config.onQuery" to be set', function () {
        var config = { onQuery: function (value) { return value; } };
        scope.config = config;
        scope.$digest();

        var controller = isolateScope[controllerAs];

        //Create spy
        spyOn(controller.config, 'onQuery');
       

        expect(controller.config.onQuery.calls.count()).toBe(0);
        controller.config.onQuery("filter", "orderBy");

        expect(controller.config.onQuery).toHaveBeenCalled();
        expect(controller.config.onQuery.calls.count()).toBe(1);
        expect(controller.config.onQuery).toHaveBeenCalledWith('filter','orderBy')
       
    });
   
    it('expect parameter: "config" to be set', function () {
        var config = { exist: true };
        scope.config = config;

        var controller = isolateScope[controllerAs];
        
        //isolateScope in the controller shouldn´t have a value yet
        expect(controller.config.exist).toBeUndefined();

        //Run digest, setting new values in outer scope
        scope.$digest();

        //Values should have been set
        expect(controller.config.exist).toBeDefined();
        expect(controller.config.exist).toBeTruthy;
    });

    it('expect parameter: "config.enableRowSelection" to work', function () {
        var config = { enableRowSelection: true };
        scope.config = config;

        var controller = isolateScope[controllerAs];

        //Should have a class to hide
        expect(directive.find('th').eq(0).hasClass("md-checkbox-column")).toBe(false);

        scope.$digest();

        //When enabled should not have the class
        expect(directive.find('th').eq(0).hasClass("md-checkbox-column")).toBe(true);
    });

    it('expect parameter: "data" to be set', function () {
        var data = [{ id: 1, name: "Name1", value: 1 }, { id: 2, name: "Name2", value: 2 }];
        scope.data = data;

        var controller = isolateScope[controllerAs];

        //isolateScope in the controller shouldn´t have a value yet
        expect(controller.data).toBeUndefined();

        //Run digest, setting new values in outer scope
        scope.$digest();

        //Values should have been set
        expect(controller.data).toBeDefined();
        expect(controller.data.length).toBe(2);
    });

    it('expect parameter: "config.columns" to render the headers in template right', function () {
        var config = {
            columns: [
                { field: 'id', displayName: 'ID' },
                { field: 'name', displayName: 'Name' },
                { field: 'value', displayName: 'Value'  }
            ]
        };
       
        scope.config = config;

        //Run digest, setting new values in outer scope
        scope.$digest();

        expect(directive.find('th').eq(0).text()).toBe(config.columns[0].displayName);
        expect(directive.find('th').eq(1).text()).toBe(config.columns[1].displayName);
        expect(directive.find('th').eq(2).text()).toBe(config.columns[2].displayName);


    });

    it('expect data to render right ', function () {
        var config = {
            columns: [
                { field: 'id', isNumeric: true, displayName: 'ID' },
                { field: 'name', isNumeric: false, displayName: 'Name' },
                { field: 'value', isNumeric: true, displayName: 'Value' }
            ]
        };

        scope.config = config;

        var data = [{ id: 1, name: 'Name1', value: 1 }, { id: 2, name: 'Name2', value: 2 }];
        scope.data = data;

        //Run digest, setting new values in outer scope
        scope.$digest();

        expect(directive.find('tbody').find('tr').eq(0).find('td').eq(0).html()).toBe(data[0].id.toString());
        expect(directive.find('tbody').find('tr').eq(0).find('td').eq(1).html()).toBe(data[0].name.toString());
        expect(directive.find('tbody').find('tr').eq(0).find('td').eq(2).html()).toBe(data[0].value.toString());

        expect(directive.find('tbody').find('tr').eq(1).find('td').eq(0).html()).toBe(data[1].id.toString());
        expect(directive.find('tbody').find('tr').eq(1).find('td').eq(1).html()).toBe(data[1].name.toString());
        expect(directive.find('tbody').find('tr').eq(1).find('td').eq(2).html()).toBe(data[1].value.toString());

    });

    it('expect parameter: "orderField" to be set', function () {
        var orderField = '-name';
        var controller = isolateScope[controllerAs];

        expect(controller.orderField).toBeUndefined();
        scope.orderField = orderField;

        //Run digest, setting new values in outer scope
        scope.$digest();

        expect(controller.orderField).toBe(orderField);
    });

    it('expect "orderField" to order data by its value', function () {
        var config = {
            columns: [
                { field: 'id', isNumeric: true, displayName: 'ID' },
                { field: 'name', isNumeric: false, displayName: 'Name' },
                { field: 'value', isNumeric: true, displayName: 'Value' }
            ]
        };

        scope.config = config;

        var data = [{ id: 1, name: 'Name1', value: 1 }, { id: 2, name: 'Name2', value: 2 }];
        scope.data = data;

        //Run digest, setting new values in outer scope
        scope.$digest();

        expect(directive.find('tbody').find('tr').eq(0).find('td').eq(0).html()).toBe(data[0].id.toString());
        expect(directive.find('tbody').find('tr').eq(1).find('td').eq(0).html()).toBe(data[1].id.toString());

        //Change orderField to order by id desc
        scope.orderField = "-id";
        scope.$digest();
        expect(directive.find('tbody').find('tr').eq(0).find('td').eq(0).html()).toBe(data[1].id.toString());
        expect(directive.find('tbody').find('tr').eq(1).find('td').eq(0).html()).toBe(data[0].id.toString());
    });

    it('expect parameter: "config.itemMenu" to render a button with menus', function () {
        //Config Param
        var config = {
            columns: [
                { field: 'id', isNumeric: true, displayName: 'ID' },
                { field: 'name', isNumeric: false, displayName: 'Name' },
                { field: 'value', isNumeric: true, displayName: 'Value' }
            ],
            itemMenu: [
                { name: 'edit', icon: 'edit', ariaLabel: 'edit', onClick: function (item) { return { 'button': 'edit', 'item': item } } },
                { name: 'select', icon: 'select', ariaLabel: 'select', onClick: function (item) { return { 'button': 'select', 'item': item }} },
                { name: 'delete', icon: 'delete', ariaLabel: 'delete', onClick: function (item) { return { 'button': 'delete', 'item': item }}, msgConfirm: {textContent:'delete item'}}
            ]
        };
        scope.config = config;

        //Data param
        var data = [{ id: 1, name: "Name1", value: 1 }, { id: 2, name: "Name2", value: 2 }];
        scope.data = data;

        var controller = isolateScope[controllerAs];

        //Should not render the menu button yet
        expect(directive.find('tbody').find('tr').eq(0).find('button').length).toBe(0);
        scope.$digest();
        
        //Should have the options button
        expect(directive.find('tbody').find('tr').eq(0).find('button').length).toBe(4);
    })

    

    //Helper Function
    function getCompiledElement(el){
        var element = angular.element("<body>" + el + "</body");
        var compiledElement = $compile(element)(scope);     
        scope.$digest();       
        return compiledElement;
    }

});