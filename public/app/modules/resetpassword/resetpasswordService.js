
(function () {
    'use strict';

    angular
        .module('resetpassword')
        .factory('resetService', serviceFn);

    serviceFn.$inject = ['$http'];
    /* @ngInject */
    function serviceFn($http) {
        var service = {};
        service.requestChangePassword        = password;
        service.changePassword        = changePassword;
        return service;
        
        /////////
       

        function password(data) {
            return $http.post('/api/requestnewpassword',data).then(handleSuccess, handleError('Error getting all users'));
        }function changePassword(data) {
            return $http.post('/api/forgotpassword',data).then(handleSuccess, handleError('Error getting all users'));
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