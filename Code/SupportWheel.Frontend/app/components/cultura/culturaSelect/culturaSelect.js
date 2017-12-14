(function () {

    'use strict';

     /**
     * @ngdoc overview
     * @name components.cultura.culturaSelect
     *
     * @description
     *
     * # culturaSelect - Component #
     *
     * This component is responsible to render a select list with autocomplete will all values of the item 'Cultura', it is
     * also responsible to change the values based on the current culture
     *
     * @example
       <pre>
        <abc-cultura-select id="id" required="required"></abc-cultura-select>
       </pre>
     */
    angular
        .module('components.cultura.culturaSelect', [
            'shared.services.service.culture'
        ])

        
    /**
    * @ngdoc directive
    * @name components.cultura.culturaSelect.directive:culturaSelect
    *
    * @restrict 'E'
    * 
    * @param {int=} id The Id of the item that is selected or should be selected. It automatically maps to intIdCultura
    * @param {boolean=} required Sets if the controller is required or not when submitting a form
    * 
    * @description
    *
    * This component will render a select list with all values of 'cultura' and control the current culture set.
    * The selected item will be available throught the parameterer 'id'
    *
    */
    .component('abcCulturaSelect', {
        templateUrl: 'app/components/cultura/culturaSelect/culturaSelect.html',
        controller: CulturaSelectController,
        bindings: {
            id: '=',
            required: '<?'
        }
    });


    //Inject Dependencies
    CulturaSelectController.$inject = ['cultureService', '$scope'];

    /**
     * @ngdoc controller
     * @name components.cultura.culturaSelect.controller:CulturaSelectController
     * @description
     *
     * It has the logic behind the component
     *
     */
    function CulturaSelectController(cultureService, $scope) {

        var vm = this;
        vm.culturas = [];

        vm.selectedItemChange = selectedItemChange;

        //Init component
        vm.$onInit = init;


        /**
        * @ngdoc function
        * @name init
        * @methodOf components.cultura.culturaSelect.controller:CulturaSelectController
        *
        * @description
        *
        * This is a private function that is called when the controller is initialized and everytime an item or culture is changed
        */
        function init() {
            cultureService.load().then(function (data) {
                vm.culturas = data;

                if (!!vm.id) {
                    var index = _.findIndex(vm.culturas, { strIdCultura: vm.id });
                    if (index > -1) {
                        vm.selectedItem = vm.culturas[index];
                    }
                }
            });
        }

        //Listen for culture Changes to update the value in the correct language
        var cultureEvent = cultureService.onCultureChange(init);
        $scope.$on('$destroy', cultureEvent);

        //Watch for changes in the id or required parameters that has been passed
        $scope.$watch(function () {
            return { id: vm.id, required: vm.required };
        }, function (newValue, oldValue) {
            // Check if value has changes
            if (newValue === oldValue) {
                return;
            }
            //When values changes, init the controller again
            init();
        }, true);


        /**
        * @ngdoc function
        * @name selectedItemChange
        * @methodOf components.cultura.culturaSelect.controller:CulturaSelectController
        *
        * @description
        *
        * Everytime a user changes the selected value this item check if the value is different from the one initial set and if are, update the parameter 'id'.
        * It also sets error messages based if the component is required or not
        */
        function selectedItemChange(item, ctrl) {
            if (!!item) {
                //Item changed
                if (item.strIdCultura != vm.id) {
                    vm.id = item.strIdCultura;
                }
                //Set requiredError to not show
                if (!!vm.required) {
                    ctrl.$setValidity("required", true);
                }
            } else {
                //clear value
                vm.id = undefined;
                //set required error to show
                if (!!vm.required) {
                    ctrl.$setValidity("required", false);
                }
            }
        }

    }
})();