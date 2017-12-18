(function () {

    'use strict';

    /**
    * @ngdoc overview
    * @name components.engineer.engineer.list
    * 
    * @description
    *
    * # swEngineerList - Component #
    *
    */
    angular
      .module('components.engineer.engineer.list', [
            'shared.services.factory.handleException',
            'shared.services.service.engineer',
            'shared.services.service.viewstate',
            'shared.services.service.notification'
        ])


     /**
     * @ngdoc directive
     * @name components.engineer.engineer.list.directive:swEngineerList
     * 
     * @restrict 'E'
     * 
     * 
     * @description
     *
     * # swEngineerList - Component #
     *
     * This component is responsible to render a list of engineers 
     *
     */
    .component('swEngineerList', {
      templateUrl: 'app/components/engineer/engineer.list/engineer.list.html',
        controller: EngineerListController,
        bindings: {

        }
    });


    //Inject Dependencies
    EngineerListController.$inject = ['handleExceptionFactory', 'viewstateService', 'notificationService', 
        'engineerService', '$scope', '$location'];


    /**
     * @ngdoc controller
     * @name components.engineer.engineer.list.controller:EngineerListController
     *
     * @requires shared.services.service.service:engineer
     * @requires shared.services.factory.service:handleException
     *
     * @description
     *
     * It has the logic behind the component
     *
     */
    function EngineerListController(handleExceptionFactory, viewstateService, notificationService,
        engineerService, $scope, $location) {

        var vm = this;
        //To avoid the data to be destroyed in case of a tab change
        vm.data = viewstateService.getView('engineerList');
        vm.data.engineers = vm.data.engineers || [];

        
        //Init component
        vm.$onInit = init;

        //PUBLIC API
        vm.selectEngineer = selectEngineer;

        /**
        * @ngdoc function
        * @name init
        * @methodOf  components.engineer.engineer.list.controller:EngineerListController
        * @private
        *
        * @description
        *
        * This is a private function that is called when the controller is initialized
        */
        function init() {

            //Configure dataList Component
            vm.config = {
                enableFilter: false,
                enableRowSelection: false,
                columns: [{ field: 'strNameEngineer', isNumeric: false, displayName: '{{"ENGINEER-LIST.NAME" | translate }}' }],
                itemMenu: [{
                    name: '{{"GENERAL.SELECT" | translate }}', icon: 'edit', ariaLabel: '{{"GENERAL.SELECT" | translate }}',
                    onClick: vm.selectEngineer
                }]
            };

            //Listen for changes on instituição
            var engineerEvent = engineerService.listenEvent.both.all(updateResult);

            //Cleanup events when controller is destroyed
            $scope.$on("$destroy", engineerEvent);

            //Responsable to change the data entered and selected by the user already to a new culture set.
            function updateResult() {
                //Se já fez uma pesquisa
                if (!!vm.data.searched) {
                    //Refaz para trazer no novo idioma
                    var data = angular.copy(vm.data);
                    data.cache = false;
                    data.applyScope = true;
                    searchEngineer(data);
                }  
            }

            searchEngineer(vm.data);
        };


        function selectEngineer(item) {
            var item = item.item;
            $location.path("/restrict/engineer/" + item.intIdEngineer);
        }

        function searchEngineer(params) {
            var query = angular.copy(params);
            delete query.engineers;
            
            //cache query if not set by the user
            if (query.cache == undefined) {
                query.cache = true;
            }

            //Get projects based on the criteria selected
            engineerService
                .load(query)
                .then(function (data) {
                    vm.data.engineers = data;
                    vm.data.searched = true;
                })
                .catch(handleExceptionFactory);
        }
    }
})();
