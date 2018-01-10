(function () {
  'use strict';
  angular
    .module('serverMeanapp')
    .factory('translationService', translationService);
  /* @ngInject */
  translationService.$inject = ['$window','$filter'];
  function translationService($window,$filter) {
    var langKey,text;
    var Service = {
      get: get,
      set: set,
      put: put,
      demand: check
    };

    return Service;

    function get(name) {
      if (!langKey) {
        langKey = $window.localStorage.getItem(name);
      }

      return langKey;
    }

    function check(transid) {
        /*$scope.$watch(
            function() { return $filter('translate')(transid); },
            function(newval) { var text  = newval; }
         );
*/
   return $filter('translate')(transid); 
    
    }

    function set(name, value) {
      var isoCode;

      if (!value || value === '') {
        value = 'en';
      }
      isoCode = value;
      langKey = value;
      // $window.moment.locale(isoCode);
      $window.localStorage.setItem(name, value);
    }

    function put(name, value) {
      var isoCode;

      if (!value || value === '') {
        value = 'en';
      }
      isoCode = value;
      langKey = value;
      // $window.moment.locale(isoCode);
      $window.localStorage.setItem(name, value);
    }
  }
})();