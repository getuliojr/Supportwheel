(function () {

    'use strict';

     /**
     * @ngdoc overview
     * @name components.listWeekCards
     *
     * @description
     *
     * # about - Component #
     *
     * This component is responsible to render information about this project
     *
     * @example
       <pre>
        <sw-about></sw-about>
       </pre>
     */
    angular
      .module('components.listWeekCards', [
        'shared.services.service.schedule',
        'shared.services.value.constantes'
      ])

        
    /**
    * @ngdoc directive
    * @name components.listWeekCards.directive:listWeekCards
    *
    * @restrict 'E'
    * 
    * @description
    *
    * This component will show information about this project
    *
    */
    .component('swListWeekCards', {
        templateUrl: 'app/components/listWeekCards/listWeekCards.html',
        controller: ListWeekCardsController,
        bindings: {

        }
    });

    ListWeekCardsController.$inject = ['scheduleService', 'constEventosDb', '$scope', '$timeout']

    /**
     * @ngdoc controller
     * @name components.listWeekCards.controller:ListWeekCardsController
     * @description
     *
     * It has the logic behind the component
     *
     */
    function ListWeekCardsController(scheduleService, constEventosDb, $scope, $timeout) {

      var vm = this;
      vm.scheduleShifts = [];
 
      //Init component
      vm.$onInit = init;


      /**
      * @ngdoc function
      * @name init
      * @methodOf components.listWeekCards.controller:ListWeekCardsController
      *
      * @description
      *
      * This is a private function that is called when the controller is initialized 
      */
      function init() {
        var weekDayNames = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ];

        //Load last drafts
        scheduleService.load().then(function (data) {
          vm.scheduleShifts = data;

          angular.forEach(vm.scheduleShifts, function (value, key) {
            var weekNumber = getWeekNumber(new Date(value.dteSchedule));
            value.weekNumber = weekNumber;
            value.weekDay = new Date(value.dteSchedule).getDay();
          });
        });

        

        //Responsable to change the data entered and selected by the user already to a new culture set.
        var updateResult = function (result) {
          //Se já fez uma pesquisa
          if (result.type = constEventosDb.INSERTED) {
            
            var update = function (result) {
              result.data.weekNumber = getWeekNumber(new Date(result.data.dteSchedule));
              result.data.weekDay = new Date(result.data.dteSchedule).getDay();
              vm.scheduleShifts.push(result.data);
              $scope.$apply();
            }

            //Wait 10 seconds to show result in the grid to keep suspense of the wheel
            $timeout(function () {
              update(result)
            }.bind(this), 14000);
    
          }

          //Listen for changes on schedule
          var scheduleEvent = scheduleService.listenEvent.both.inserted(updateResult);

          //Cleanup events when controller is destroyed
          $scope.$on("$destroy", scheduleEvent);
        }
      }

      /**
      * @ngdoc function
      * @name getWeekNumber
      * @methodOf components.listWeekCards.controller:ListWeekCardsController
      *
      * @description
      *
      * This is a private function responsable to return the number of the week from a specific date
      */
      function getWeekNumber(d) {
        // Copy date so don't modify original
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        // Get first day of year
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        // Calculate full weeks to nearest Thursday
        var weekNo = ("0" + Math.ceil((((d - yearStart) / 86400000) + 1) / 7)).slice(-2)  ;
        // Return array of year and week number
        return d.getUTCFullYear() + "/" + weekNo;
      }
      
    }
})();
