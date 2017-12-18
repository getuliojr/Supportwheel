(function () {

    'use strict';

    /**
    * @ngdoc overview
    * @name components.engineer.engineer.form
    * 
    * @description
    *
    * # swEngineerForm - Component #
    *
    */
    angular
      .module('components.engineer.engineer.form', [
            'shared.services.factory.handleException',
            'shared.services.service.engineer',
            'shared.services.service.viewstate',
            'shared.services.service.notification'
        ])


     /**
     * @ngdoc directive
     * @name components.engineer.engineer.form.directive:swEngineerForm
     * 
     * @restrict 'E'
     * 
     * @param {int=} id Id of an Engineer to be loaded
     * 
     * @description
     *
     * # swEngineerForm - Component #
     *
     * This component is responsible to render a form with all values of an engineer, so it can be updated or deleted.
     *
     */
    .component('swEngineerForm', {
      templateUrl: 'app/components/engineer/engineer.form/engineer.form.html',
        controller: EngineerFormController,
        bindings: {
            id:"<?"
        }
    });


    //Inject Dependencies
    EngineerFormController.$inject = ['handleExceptionFactory', 'viewstateService', 'notificationService', 
        'engineerService', '$location'];


    /**
     * @ngdoc controller
     * @name components.engineer.engineer.form.controller:EngineerFormController
     *
     * @requires shared.services.service.service:engineer
     * @requires shared.services.factory.service:handleException
     *
     * @description
     *
     * It has the logic behind the component
     *
     */
    function EngineerFormController(handleExceptionFactory, viewstateService, notificationService, 
        engineerService, $location) {

        var vm = this;

        //To avoid the data to be destroyed in case of a tab change
        vm.data = viewstateService.getView('Engineer');
      

        //Init component
        vm.$onInit = init;

        //PUBLIC API
        vm.save = save;
        vm.remove = remove;
        vm.newEngineer = newEngineer;

        /**
        * @ngdoc function
        * @name init
        * @methodOf  components.instituicao.instituicao.form.controller:InstituicaoFormController
        * @private
        *
        * @description
        *
        * This is a private function that is called when the controller is initialized
        */
        function init() {

            //Load the data of the project
            if (vm.id != undefined) {
                engineerService
                    .load({ intIdEngineer: vm.id })
                    .then(function (data) {
                        if (data.intIdEngineer == undefined) {
                            notificationService.show('error', "GENERAL.ERROR-NOTFOUND");
                            //Apaga dados que poderiam existir na view em memória
                            viewstateService.newView('Engineer');
                            $location.path("restrict/engineer");
                        } else {
                            vm.form = data;
                        }

                    })
                    .catch(handleExceptionFactory);
            }

        };



        /**
        * @ngdoc function
        * @name save
        * @methodOf  components.engineer.engineer.form.controller:EngineerFormController
        * @param {object} enginner Expect an object of the data of the engineer that should be saved
        *
        * @description
        *
        * This is responsable to save the institution to the database.
        */
        function save(engineer) {
            var successCB = function (result) {
                notificationService.show('success', "GENERAL.SAVED-SUCCESSFULLY");
                
                //redirect to edit page
                $location.path("restrict/engineer/" + result.intIdEngineer);
            }

            var params = angular.copy(engineer);

            engineerService.save(params).then(successCB, handleExceptionFactory);
          
        }

       /**
       * @ngdoc function
       * @name remove
       * @methodOf  components.engineer.engineer.form.controller:EngineerFormController
       * @param {int} intIdEngineer Expect an id of the engineer to be deleted
       *
       * @description
       *
       * This is responsable to remove the engineer to the database.
       */
        function remove(intIdEngineer) {
            var successCB = function (result) {
                notificationService.show('success', "GENERAL.REMOVED-SUCCESSFULLY");
                //Apaga dados que poderiam existir na view em memória
                viewstateService.newView('Engineer');
                $location.path("restrict/engineer");
            }

            engineerService.remove({ intIdEngineer: intIdEngineer })
                .then(successCB, handleExceptionFactory);
        }

      /**
      * @ngdoc function
      * @name newEngineer
      * @methodOf  components.engineer.engineer.form.controller:EngineerFormController
      *
      * @description
      *
      * This is responsable to redirect the user to a new form
      */
        function newEngineer() {
            viewstateService.newView('Engineer');
            $location.path("restrict/engineer");
        }
    }
})();
