(function () {

    'use strict';

     /**
     * @ngdoc overview
     * @name components.deleteSchedule
     *
     * @description
     *
     * # deleteSchedule - Component #
     *
     * This component is responsible to render a button to clean the drafts so far
     *
     * @example
       <pre>
        <sw-delete-schedule></sw-delete-schedule>
       </pre>
     */
    angular
      .module('components.deleteSchedule', [
        'shared.services.factory.handleException',
        'shared.services.service.schedule',
        'shared.services.service.notification'
      ])

        
    /**
    * @ngdoc directive
    * @name components.deleteSchedule.directive:swDeleteSchedule
    *
    * @restrict 'E'
    * 
    * @description
    *
    * This component will show a button to clean the drafts so far in the database
    *
    */
    .component('swDeleteSchedule', {
        templateUrl: 'app/components/deleteSchedule/deleteSchedule.html',
        controller: DeleteScheduleController,
        bindings: {

        }
    });


    DeleteScheduleController.$inject = ['handleExceptionFactory', 'scheduleService', 'notificationService'];

    /**
     * @ngdoc controller
     * @name components.deleteSchedule.controller:DeleteScheduleController
     * @description
     *
     * It has the logic behind the component
     *
     */
    function DeleteScheduleController(handleExceptionFactory, scheduleService, notificationService) {

      var vm = this;
     
      vm.deleteSchedule = deleteSchedule;

      /**
          * @ngdoc function
          * @name deleteSchedule
          * @methodOf  components.deleteSchedule.controller:DeleteScheduleController
          * @private
          *
          * @description
          *
          * This is a function responsable to delete data from the schedule in the database
          */
      function deleteSchedule() {

        scheduleService.remove()
          .then(function (result) {
            notificationService.show('success', "GENERAL.REMOVED-SUCCESSFULLY");
          })
          .catch(handleExceptionFactory);
      }
      
    }
})();
