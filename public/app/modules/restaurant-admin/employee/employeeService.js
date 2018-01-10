
(function () {
    'use strict';

    angular
        .module('employeemanagement')
        .factory('employeeService', serviceFn);

    serviceFn.$inject = ['$http'];
    /* @ngInject */
    function serviceFn($http) {
        var service = {};
        service.createEmployee        = createEmployeeDetails;
        service.myEmployees           = employeeList;
        service.updateEmployee        = updateEmployeDetails;
        service.DeleteEmployee        = deleteEmployeDetails;
        return service;
        
        /////////
       

        function createEmployeeDetails(data) {
            return $http.post('/api/v1/create/employee',data).then(handleSuccess, handleError('Error getting all users'));
        }
        function employeeList() {
             return $http.get('/api/v1/get/employee').then(handleSuccess, handleError('Error getting all users'));
        }
        function updateEmployeDetails(data) {
            return $http.post('/api/v1/update/employee',data).then(handleSuccess, handleError('Error getting all users'));
        }
        function deleteEmployeDetails(data) {
            return $http.post('/api/v1/employee/delete/'+data.userinfo).then(handleSuccess, handleError('Error getting all users'));
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