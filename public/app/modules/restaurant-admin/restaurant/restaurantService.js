
(function () {
    'use strict';

    angular
        .module('restaurant')
        .factory('restaurantService', serviceFn);

    serviceFn.$inject = ['$http'];
    /* @ngInject */
    function serviceFn($http) {
        var service = {};
        service.getList        = getRestaurant;
        return service;
        
        /////////
       

        function getRestaurant() {
            return $http.get('/api/v1/restaurants').then(handleSuccess, handleError('Error getting all users'));
        }
       


        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();