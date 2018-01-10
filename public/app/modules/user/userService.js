
(function () {
    'use strict';

    angular
        .module('usermodule')
        .factory('userService', serviceFn);

    serviceFn.$inject = ['$http'];
    /* @ngInject */
    function serviceFn($http) {
        var service = {};
        service.getUsers        = getUsers;
        service.createUser      = createUser;
        service.UpdateUser      = UpdateUser;
        service.DeleteUser     	= deleteUser;

        return service;
        
        /////////
       

        function getUsers() {
            return $http.get('/api/v1/users').then(handleSuccess, handleError('Error getting all users'));
        }
        function createUser(data) {
            return $http.post('/api/v1/create/user',data).then(handleSuccess, handleError('Error getting all users'));
        }
        function UpdateUser(data) {
            return $http.post('/api/v1/update/user',data).then(handleSuccess, handleError('Error getting all users'));
        }
         function deleteUser(data) {
            return $http.post('/api/v1/user/delete/'+data.userinfo).then(handleSuccess, handleError('Error getting all users'));
        }
        
 
	   // private functions

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