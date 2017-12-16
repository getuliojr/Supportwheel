(function () {

    'use strict';

     /**
     * @ngdoc overview
     * @name components.spinButton
     *
     * @description
     *
     * # spinButton - Component #
     *
     * This component is responsible to show the next draft and period information and
     * a button to be spinned for the user
     *
     * @example
       <pre>
        <sw-spin-button></sw-spin-button>
       </pre>
     */
    angular
      .module('components.spinButton', [
        'shared.services.service.schedule',
        'shared.services.service.notification',
        'shared.services.factory.handleException'
      ])

        
    /**
    * @ngdoc directive
    * @name components.spinButton.directive:spinButton
    *
    * @restrict 'E'
    * 
    * @description
    *
    * This component is responsible to show the next draft and period information and
    * a button to be spinned for the user
    *
    */
      .component('swSpinButton', {
        templateUrl: 'app/components/spinButton/spinButton.html',
        controller: SpinButtonController,
        bindings: {
          
        }
    });

    SpinButtonController.$inject = ['scheduleService', 'notificationService', 'handleExceptionFactory']

    /**
     * @ngdoc controller
     * @name components.spinButton.controller:SpinButtonController
     * @description
     *
     * It has the logic behind the component
     *
     */
    function SpinButtonController(scheduleService, notificationService, handleExceptionFactory) {
      var vm = this;

     //Init component
      vm.$onInit = init;

      //Public API
      vm.spin = spin;
      /**
      * @ngdoc function
      * @name init
      * @methodOf components.spinButton.controller:SpinButtonController
      *
      * @description
      *
      * This is a private function that is called when the controller is initialized 
      */
      function init() {
        scheduleService.load({ intPageSize: 1, intPageNumber: 1 }).then(function (data) {
          var i = 0;
          //Try to get the last date and period from the database
          if (data.length > 0) {
            vm.lastDate = data[0].dteSchedule;
            vm.lastPeriod = data[0].intPeriod;
            vm.lastEngineer = data[0].strNameEngineer;
            vm.lastDraftBy = data[0].strFullNameCreated;
          } else {
            vm.lastDate = new Date();
            vm.lastPeriod = 1;
            
          }
        });
      }

      function spin(date, period) {
        scheduleService.save({ dteSchedule: date, intPeriod : period }).then(function (result) {
          vm.lastDate = result.dteSchedule;
          vm.lastPeriod = result.intPeriod;
          vm.lastEngineer = result.strNameEngineer;
          vm.lastDraftBy = result.strFullNameCreated;
          notificationService.show('success', "SPINBUTTON.SUCCESS-SAVED");
        }, handleExceptionFactory)
      }
    }
})();
