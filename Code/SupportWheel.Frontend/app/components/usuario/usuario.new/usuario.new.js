(function () {

    'use strict';

    /**
    * @ngdoc overview
    * @name components.usuario.usuario.new
    * 
    * @description
    *
    * # abcUsuarioNew - Component #
    *
    */
    angular
        .module('components.usuario.usuario.new', [
            'shared.services.factory.handleException',
            //'shared.services.service.culture',
            'shared.services.service.usuario',
            'shared.services.service.viewstate',
            'shared.services.service.notification'
        ])


     /**
     * @ngdoc directive
     * @name components.usuario.usuario.new.directive:abcUsuarioNew
     * 
     * @restrict 'E'
     * 
     * 
     * @description
     *
     * # abcUsuarioNew - Component #
     *
     * This component is responsible to render an empty form to insert a new user.
     *
     */
    .component('abcUsuarioNew', {
        templateUrl: 'app/components/usuario/usuario.new/usuario.new.html',
        controller: UsuarioNewController,
        bindings: {

        }
    });


    //Inject Dependencies
    UsuarioNewController.$inject = ['handleExceptionFactory', 'viewstateService', 'notificationService', 
        'usuarioService', '$location'];


    /**
     * @ngdoc controller
     * @name components.usuario.usuario.new.controller:UsuarioNewController
     *
     * @requires shared.services.service.service:usuario
     * @requires shared.services.factory.service:handleException
     *
     * @description
     *
     * It has the logic behind the component
     *
     */
    function UsuarioNewController(handleExceptionFactory, viewstateService, notificationService, 
        instituicaoService, $location) {

        var vm = this;

        //To avoid the data to be destroyed in case of a tab change
        vm.data = viewstateService.getView('Usuario');
      

        //Init component
        vm.$onInit = init;

        //PUBLIC API
        vm.saveUsuario = saveUsuario;
        

        /**
        * @ngdoc function
        * @name init
        * @methodOf  components.usuario.usuario.new.controller:UsuarioNewController
        * @private
        *
        * @description
        *
        * This is a private function that is called when the controller is initialized
        */
        function init() {


        };



        /**
        * @ngdoc function
        * @name saveUsuario
        * @methodOf  components.usuario.usuario.new.controller:UsuarioNewController
        * @param {object} usuario Expect an object of the data of the usuario that should be saved
        *
        * @description
        *
        * This is responsable to save the user to the database.
        */
        function saveUsuario(usuario) {
            var successCB = function (result) {
                notificationService.show('success', "GENERAL.SAVED-SUCCESSFULLY");
                
                //redirect to edit page
                $location.path("restrita/usuario/" + result.intIdUsuario);
            }

            var params = angular.copy(usuario);

            usuarioService.save(params).then(successCB, handleExceptionFactory);
          
        }

     
    }
})();
