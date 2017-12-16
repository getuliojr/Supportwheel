(function () {

    'use strict';

     /**
     * @ngdoc overview
     * @name components.core.createTabs
     * @description
     *
     * # createTabs - Component #
     *
     * This module is responsible for creating the tabs that will be available for the user. 
     * It encapsulates all the logic necessary, making it really simpler to use.
     * It just need to be configured
     *
     * @example
       <pre>
        <create-tabs tabs="tabs.list" title="title"><create-tabs />
       </pre>
     */
    angular
        .module('components.core.createTabs', [
            
        ])

        .directive('createTabs', createTabsDirective)
        .controller('CreateTabsController', CreateTabsController);

    /**
     * @ngdoc directive
     * @name components.core.createTabs.directive:createTabs
     * @restrict 'E'
     * @param {string=} title The name of the group of tabs. 
     * @param {array} tabs It should be an array of objects. The following properties are available:
     *      <ul>
     *          <li>tabName - {string} - The name of the tab. (Required)</li>
     *          <li>tabViewName - {string} - The name of the view to be set inside the tab, so it can be referred by ui-router. (Required)</li>
     *          <li>tabStates - {array} - The name of the states that initiate the tab. Everytime the controller is iniated it checks if any of this view is current, 
     * if it is the correspondent tab is selected
     *          <li>tabIcon - {string} - name of the icon from material design icons. (Optional)</li>
     *      </ul>
     * @description
     *
     * This directive render the layout required to show the tabs for the user to interact.
     *
     */
    function createTabsDirective() {
        return {
            restrict: 'E',
            controller: 'CreateTabsController',
            templateUrl: 'app/components/core/createTabs/createTabs.html',
            controllerAs: 'createTabs',
            scope: {},
            bindToController: {
                tabs: "<?",
                title: "<?",
                currentView: "<?"
            }
        }
    }

    //Inject Dependencies
    CreateTabsController.$inject = ['$state', '$location', '$scope'];

    /**
     * @ngdoc controller
     * @name components.core.createTabs.controller:CreateTabsController
     * @description
     *
     * Responsable for the interface with the tabs
     *
     */
    function CreateTabsController($state, $location, $scope) {
        var vm = this;

        vm.onTabSelected = onTabSelected;

        //Set right tab, based on the new route
        $scope.$on('$stateChangeSuccess', function () {
            init();
        });

        init();

        /**
        * @ngdoc function
        * @name init
        * @methodOf components.core.createTabs.controller:CreateTabsController
        *
        * @description
        *
        * It inits the controller and set the current tab when the page is first loaded. After that the md-tabs keeps it in sync
        */
        function init() {
            vm.currentTab = 0; //Defaults to first

            if (vm.currentView != undefined && _.findIndex(vm.tabs, { tabViewName: vm.currentView }) > -1) {
                vm.currentTab = _.findIndex(vm.tabs, { tabViewName: vm.currentView });
            }
            else {
                //Check if the currentState maps to a TAB
                _.forEach(vm.tabs, function (tab, index) {
                    if (_.indexOf(tab.tabStates, $state.current.name) > -1) {
                        vm.currentTab = index;
                        return;
                    }
                });
            }
        }

        /**
       * @ngdoc function
       * @name onTabSelected
       * @methodOf components.core.createTabs.controller:CreateTabsController
       *
       * @description
       *
       * It replaces the current view with a new one, based on the view name of the tab selected
       */
        function onTabSelected(tab) {
            vm.currentTab = _.findIndex(vm.tabs, { tabViewName: tab.tabViewName });
        }


        //Watch for changes in the property 'currentTabIndex'
        $scope.$watch(function () {
            return { currentView: vm.currentView };
        }, function (newValue, oldValue) {
            // Check if value has changes
            if (newValue === oldValue) {
                return;
            }
            //When values changes, init the controller again to parse the values in the component
            init();
        }, true);
    }
})();