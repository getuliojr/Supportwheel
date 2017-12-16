(function () {

    'use strict';

     /**
     * @ngdoc overview
     * @name components.core.dataList
     * @description
     *
     * # dataList - Component #
     *
     * This module is responsible to genereate a grid view of the data that has been passed. It makes it easier to add buttons for edit, delete. 
     * It has options to select many itens in the list or even filter data local or remote.
     *
     * @example
       <pre>
        <data-list config="config" data="data", selected="selected" order-field="orderField"><data-list />
       </pre>
     */
    angular
        .module('components.core.dataList', [
            
        ])

        .directive('abcDataList', dataListDirective)
        .controller('DataListController', DataListController);

    //Inject Dependencies
    dataListDirective.$inject = [];

    /**
     * @ngdoc directive
     * @name components.core.dataList.directive:dataList
     * @restrict 'E'
     * @param {object} config It is responsible for the configuration of the dataList. The following properties are available:
     *      <ul>
     *          <li>title - {string=} - A name for the dataList. (Optional)</li>
     *          <li>enableRowSelection - {boolean=} When true it will enable multiple selection in the dataList.
     *          <li>enableFilter - {boolean=} - When true it enables a filter button on the dataList that will filter itens local and also pass the search predicate to the function onQuery. (Optional)</li>
     *          <li>onQuery - {function=} - When set everytime the filter or the orderBy value changes it calls this function with new values so a new query can be run on the server. 
     * The function should have two parameters. The first one is the filter that has changed and the second is the orderBy that has changed. (Optional)</li>
     *          <li>columns - {object} - This is where your should configure all the columns the dataList will have. It expect the following properties:  (Required)
     *              <ul>
     *                  <li>field - {string} - The name of the field that will be present in the data. (Required)</li>
     *                  <li>displayName - {string} - How the name of the field should be in the column header. (Required)</li>
     *                  <li>isNumeric - {boolean=} - When true the column will align the values at the right on the column. (Optional)</li>
     *              </ul>
     *          </li>
     *          <li>itemMenu - {object} - This is where you can configure buttons and callbacks for each item in the list, so the user can interact with it. It expect the folowing properties: (Optional)
     *              <ul>
     *                  <li>name - {string=} You can set a name in the controller that accepts translation, if found. The name or a icon should be set or both. (Optional when the icon is set)</li>
     *                  <li>icon - {string=} You can set the name of the icon from the material design collection and it will render it. (Optional when the name is set)</li>
     *                  <li>ariaLabel - {string=} When set it will configure the aria property.</li>
     *                  <li>onClick - {function} Here you have to pass a function that will receive the item that the user selected. (Required)</li>
     *                  <li>msgConfirm - {object=} Here you can configure a pop-up message for the user to confirm before the onClick runs. 
     * You can set it with only defauls using an empty object or configure every parameter of the msgConfirm Component. (Optional)</li>
     *              </ul>
     *          </li>
     *          <li>multipleItemMenu - {object} - This is where you can configure buttons and callbacks for when the user select one or more itens using checkbox. It expect the folowing properties: (Optional)
     *              <ul>
     *                  <li>name - {string=} You can set a name in the controller that accepts translation, if found. The name or a icon should be set or both. (Optional when the icon is set)</li>
     *                  <li>icon - {string=} You can set the name of the icon from the material design collection and it will render it. (Optional when the name is set)</li>
     *                  <li>ariaLabel - {string=} When set it will configure the aria property.</li>
     *                  <li>onClick - {function} Here you have to pass a function that will receive the item that the user selected. (Required)</li>
     *                  <li>msgConfirm - {object=} Here you can configure a pop-up message for the user to confirm before the onClick runs. 
     * You can set it with only defauls using an empty object or configure every parameter of the msgConfirm Component. (Optional)</li>
     *              </ul>
     *          </li>
     *      </ul>
     *
     * @param {array} data It expect an array with all the data that will be available in the list. All data that is in the headers are required.
     *
     * @param {selected=} selected It holds all the itens that are selected in the list or should be selected.
     *
     * @param {string=} orderField The name of the field to orderBy in the list. If descending it should start with - example: "-name". If the user click on other column it will be here too.
     *
     * @description
     *
     * This directive will render a dataList so the user can interact with it.
     *
     */
    function dataListDirective() {
        return {
            restrict: 'E',
            controller: 'DataListController',
            templateUrl: 'app/components/core/dataList/dataList.html',
            controllerAs: 'dataList',
            scope: {},
            bindToController: {
                config: '=',
                data: '=',
                selected: '=?',
                enablePagination: "<?",
                orderByField: '=',
                pageSize: '=?',
                pageNumber: '=?',
                totalRecords: '<?',
                onPaginate: '&'
            }
        }
    }

    //Inject Dependencies
    DataListController.$inject = ['$filter', '$scope'];

    /**
     * @ngdoc controller
     * @name components.core.dataList.controller:DataListController
     * @description
     *
     * It has all the logic for the component dataList
     *
     */
    function DataListController($filter, $scope) {

        var vm = this;
        //Init component
        vm.$onInit = init;

        vm.paginate = paginate;

        function paginate() {
            //call paginate function
            if (vm.onPaginate != undefined) {
                vm.onPaginate();
            }
        }


        /**
        * @ngdoc function
        * @name init
        * @methodOf  components.core.dataList.controller:DataListController
        * @private
        *
        * @description
        *
        * This is a private function that is called when the controller is initialized
        */
        function init() {

            //create empty selected list if not set
            if (vm.selected == undefined) {
                vm.selected = [];
            }

            //At start filtered data is equal data, since it has not changed yet
            vm.filteredData = vm.data;

            //Filter options, initial configuration
            vm.filter = {
                value: '',
                options: {
                    updateOn: 'default blur',
                    debounce: { default: 200, blur: 0 }
                }
            };

            if (vm.pageNumber == undefined) {
                vm.pageNumber = 1;
            }

            if (vm.pageSize == undefined) {
                vm.pageSize = 5;

            }

        };



        


        //API available
        vm.removeFilter = removeFilter;
        vm.filterChanged = filterChanged;
        vm.orderByChanged = orderByChanged;

        


        /**
        * @ngdoc function
        * @name filterChanged
        * @methodOf components.core.createTabs.controller:CreateTabsController
        *
        * @description
        *
        * Eveytime the user changes the filter of the list this function is called
        */
        function filterChanged(newFilter) {
            if (!!vm.config.onQuery) {
                vm.config.onQuery(newFilter, vm.orderByField);
            }
            //Apply local filter
            filterList(newFilter, vm.orderByField);
        }

        /**
        * @ngdoc function
        * @name orderByChanged
        * @methodOf components.core.createTabs.controller:CreateTabsController
        *
        * @description
        *
        * Everytime the user changes de orderBy field of the list this function is called
        */
        function orderByChanged(newOrderBy) {
            if (!!vm.config.onQuery) {
                vm.config.onQuery(vm.filter.value, newOrderBy);
            }
            //Apply local filter
            filterList(vm.filter.value, newOrderBy);
        }

        /**
        * @ngdoc function
        * @name removeFilter
        * @methodOf components.core.createTabs.controller:CreateTabsController
        *
        * @description
        *
        * When the user clicks the button to remove the filter in the screen this function is called so it can clear its value and reset the filtered list.
        */
        function removeFilter() {
            //Hide search filter
            vm.filter.show = false;

            //Remove local filter value
            vm.filter.value = '';
            filterList(vm.filter.value, vm.orderByField);

            //Reset form
            if (vm.filter.form.$dirty) {
                vm.filter.form.$setPristine();
            }
        };

        //********************
        // Helper Functions
        //********************

        //Watch for changes in the data or orderField that has been passed
        $scope.$watch(function () {
            return { data: vm.data, orderField: vm.orderByField };
        }, function (newValue, oldValue) {
            // Check if value has changes
            if (newValue === oldValue) {
                return;
            }

            filterList(vm.filter.value, vm.orderByField);
        }, true);


        /**
        * @ngdoc function
        * @name filterList
        * @methodOf components.core.createTabs.controller:CreateTabsController
        *
        * @description
        *
        * This is a private function responsible to filter the data with the value the user has typed or the orderBy field
        */
        function filterList(filter, orderBy) {
            var filtered = $filter('filter')(vm.data, filter);
            filtered = $filter('orderBy')(filtered, orderBy);
            vm.filteredData = filtered;
        };
    }
})();