(function () {

  'use strict';

  /**
   * @ngdoc service
   *
   * @name shared.services.service.service:culture
   *
   * @requires $localStorage - Source: {@link https://github.com/gsklee/ngStorage ngStorage}
   * @requires $mdDialog - Source: {@link https://github.com/angular/material angular-material}
   * @requires $translate - Source: {@link https://github.com/angular-translate/angular-translate angular-translate}
   *
   * @description
   *
   * This service is responsable to get and set current culture for the application
   *
   */
  angular.module('shared.services.service.culture', [

  ])
    .service('cultureService', cultureService);

  //Injeta dependencias
  cultureService.$inject = ['$localStorage', '$mdDialog', '$translate', '$q'];

  //Cria o serviço
  function cultureService($localStorage, $mdDialog, $translate, $q) {

    var _eventListenQueue = [];

    this.load = load;
    this.getCulture = getCulture;
    this.setCulture = setCulture;
    this.onCultureChange = onCultureChange;

    init();

    /**
   
    * @ngdoc function
    * @name init
    * @methodOf shared.services.service.service:culture
    * @private
    *
    * @description
    *
    * It inits the service by loading the current set language from the localstorage.
    * If no language is available it show a modal for the user to choose one. This modal cannot be closed or canceled.
    *
    */
    function init() {
      if (getCulture() == undefined) {
        setTimeout(function () {
          $mdDialog.show({
            template: '<choose-language><choose-language />',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            escapeToClose: false
          });
        }, 4)
        onCultureChange($mdDialog.hide);
      } else {
        var currentCulture = getCulture();
        $translate.use(currentCulture.culture);
      }
    }


    /**
   
    * @ngdoc function
    * @name load
    * @methodOf shared.services.service.service:culture
    * @private
    *
    * @description
    *
    * It returns the collection 'culture' with its value set with the current culture.
    *
    */
    function load() {
      //Since it is just a small list there is no need to go to the backend to get the results
      var data = [
        { strIdCultura: 'pt-BR', strNomeCultura: 'CULTURA.PORTUGUES' },
        { strIdCultura: 'en-US', strNomeCultura: 'CULTURA.INGLES' },
      ]

      var deferred = $q.defer();
      //Wait initial loading of a culture.json file
      $translate.onReady(function () {
        angular.forEach(data, function (val, key) {
          data[key].strNomeCultura = $translate.instant(data[key].strNomeCultura);
        });

        deferred.resolve(data);
      });

      return deferred.promise;

    }


    /**
    * @ngdoc function
    * @name onCultureChange
    * @methodOf shared.services.service.service:culture
    * @param {function} callback expect a callback function that will be called with the new culture set
    * @returns {function} It returns an unsubscribe function that should be used on $destroy event in the controller
    * @description
    *
    * Responsable to get the current culture selected in the application
    * It reads from localstorage in the browser.
    *
    */
    function onCultureChange(callback) {

      _eventListenQueue.push(callback);

      //So it can be used with $destroy for example
      return unsubscribeEvent;

      //Return an Unsubscribe Event
      function unsubscribeEvent() {
        var indexItem = _eventListenQueue.indexOf(callback);
        if (indexItem > -1) {
          _eventListenQueue.splice(indexItem, 1);
        }
      }
    }

    /**
    * @ngdoc function
    * @name getCulture
    * @methodOf shared.services.service.service:culture
    * @returns {object} It returns an object with the properties { culture (string) , name (string) }
    * @description
    *
    * Responsable to get the current culture selected in the application
    * It reads from localstorage in the browser.
    *
    */
    function getCulture() {
      return $localStorage.culture;
    }


    /**
    * @ngdoc function
    * @name setCulture
    * @methodOf shared.services.service.service:culture
    * @param {string} culture expect a culture in the format 'pt-BR'
    *
    * @description
    *
    * Responsable to set a new culture for the application. It saves the result
    * in the localstorage of the browser
    *
    */
    function setCulture(culture) {
      var newCulture;
      if (culture == 'pt-BR') {
        newCulture = { culture: culture, name: 'Português' };
      } else if (culture == 'en-US') {
        newCulture = { culture: culture, name: 'English' };
      }

      $localStorage.culture = newCulture;
      //Set new culture
      $translate.use(culture);

      //Send event subscribers that the culture has changed
      //Call users who subscribed to event
      var lengthEvent = _eventListenQueue.length;
      for (var e = 0; e < lengthEvent; e++) {
        _eventListenQueue[e](newCulture);
      }


    }


  }
})();
