(function () {
    'use strict';

    angular
        .module('dashboard')
        .factory('dashboardService', dashboardService);

    dashboardService.$inject = ['$http'];
    
    function dashboardService($http) {
        var service = {};

        service.init        = init
        service.getInfo     = getInfo;
        service.getToken    = tokenGet;
        service.shownewToken    = shownewToken;
        service.newToken    = newToken;

        return service;
        
        function init () {
            $http.get('/api/v1/tokenGet').then(function(response) {
                return response.data
            }, handleError('Error getting user data'));
        };


        function getInfo() {
            return $http.get('/api/v1/getdata').then(handleSuccess, handleError('Error getting user data'));
        }
        function tokenGet() {
            return $http.get('/api/v1/tokenGet').then(handleSuccess, handleError('Error getting user data'));
        }
        function shownewToken() {
            return $http.post('/api/v1/generatetoken').then(handleSuccess, handleError('Error getting user data'));
        }
        function newToken(data) {
            return $http.post('/api/v1/savetoken',data).then(handleSuccess, handleError('Error getting user data'));
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