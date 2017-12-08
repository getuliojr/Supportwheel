function AppConfig($logProvider, $stateProvider, $locationProvider, $urlRouterProvider) {
    'ngInject';

    // Enable log
    $logProvider.debugEnabled(true);

    $locationProvider.html5Mode(true);

    $stateProvider
        .state('app', {
            abstract: true,
            component: 'app'
        });

    $urlRouterProvider.otherwise('/');
}

export default AppConfig;