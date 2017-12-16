(function () {

    'use strict';

    /**
     * @ngdoc overview
     * @name components.core.signup
     * @description
     *
     * # Signup - Component #
     *
     * This module is responsible to show a signup form 
     * description for more details
     *
     * @example
       <pre>
        <sw-signup><sw-signup />
       </pre>
     */
    angular
        .module('components.core.signup', [
          'shared.services.service.user',
          'shared.services.service.notification',
          'shared.services.factory.handleException'
        ])


     /**
     * @ngdoc directive
     * @name components.core.signup.directive:signup
     * @restrict 'E'
     * @description
     *
     * This directive render a signup form for the user to register with e-mail and password.
     * It validades if the e-mail is valid
     *
     */
      .component('swSignup', {
        templateUrl: 'app/components/core/signup/signup.html',
        controller: SignupController
      });


    //Injeta dependencias
    SignupController.$inject = ['userService', 'notificationService', 'handleExceptionFactory'];

    /**
     * @ngdoc controller
     * @name components.core.signup.controller:SignupController
     * @requires shared.services.service.service:user
     * @description
     *
     * Responsable to make the login, getLoginReason and getLastAuthError available from the securityService
     *
     */
    function SignupController(userService, notificationService, handleExceptionFactory) {
        var vm = this;

        vm.form = {};

        //PUBLIC API
        vm.signup = signup;

        vm.teste = teste;

        function teste(g) {
          console.log(g);
        }

        /**
        * @ngdoc function
        * @name signup
        * @methodOf components.core.signup.controller:SignupController
        * @description
        * Sends user information to the server to register user
        *
        */
        function signup(formData) {
         
          userService.save(formData).then(function (result) {

              notificationService.show('success', "SIGNUP.REGISTERED");
            }, handleExceptionFactory)
          
        }
     
    }
})();
