describe('shared.services: appResourceFactory', function () {

	//Variable for itens that are going to be used in the tests
	var $resource, $q, $rootScope, $httpBackend, factory, appResourceFactory, mockDb;

	//Load Services
	beforeEach(module('shared.services', 'ngStorage', 'ngResource', 'ngMaterial',
		'pascalprecht.translate', 'SignalR'));

	//Inject Dependencies
	beforeEach(inject(function (_$resource_, _$q_, _$rootScope_, _$httpBackend_, _appResourceFactory_, _MockHttpFactory_) {
		
		$resource = _$resource_;
		$q = _$q_;
		$rootScope = _$rootScope_;
		$httpBackend = _$httpBackend_;
		appResourceFactory = _appResourceFactory_;
		var seedData = [
			{ 'intIdKey': 1, 'strNomResource': 'resourceOne' },
			{ 'intIdKey': 2, 'strNomResource': 'resourceTwo' }
		];
		mockDb = _MockHttpFactory_('resource', 'intIdKey', seedData);
	}));

	it("expect instance to be created", function () {

		factory = appResourceFactory('resource', '');
		expect(factory).toBeDefined();
		expect(factory.load).toBeDefined();
	});


	describe('Http Backend Tests', function () {

		afterEach(function () {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it("expect load without parameters to work", function () {

			var data;
			factory = appResourceFactory('resource', '');
			factory.load().then(function (result){
				data = result;
				expect(data).toBeDefined();				
				expect(data.length).toBe(2);
			});
			$httpBackend.flush();
			$rootScope.$digest();
			
		});
	});
	

});