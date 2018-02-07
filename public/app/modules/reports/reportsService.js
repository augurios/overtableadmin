(function () {
    'use strict';

    angular
        .module('reports')
        .factory('reportsService', dashboardService);

    dashboardService.$inject = ['$http','$q'];
    
    function dashboardService($http, $q) {
        var service = {};

        service.init        = init
        service.getInfo     = getInfo;
        service.getToken    = tokenGet;
        service.shownewToken    = shownewToken;
        service.newToken    = newToken;
        service.GetShifting = GetShifting;
        service.GetShiftByDate = GetShiftByDate;
        service.getUserDetails = getUserDetails;
        service.updateUser = updateUser;
        service.updateUserImageToDB = updateUserImageToDB;
        return service;
        
        function init () {
            $http.get('/api/v1/tokenGet').then(function(response) {
                return response.data
            }, handleError('Error getting user data'));
        };

        function getUserDetails(id) {
            return $http.get('/api/v1/getuserbyid/' + id).then(handleSuccess, handleError('Error getting user data'));
        }

        function updateUser(user, password) {
            return $http.post('/api/v1/updateUser', { user: user, password: password }).then(handleSuccess, handleError('Error getting user data'));
        }

        function updateUserImageToDB(id, imageurl) {
            return $http.post('/api/v1/updateUserimage', { userid: id, imageurl: imageurl }).then(handleSuccess, handleError('Error getting user data'));
        }

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

        function GetShifting(restid) {
            return $q((resolve, reject) => {
                $http.get('/api/get/getshift', restid).then(function (res) {

                    resolve(res.data);
                    
                }, handleError('Error getting user data'));
            });
        }
       

        function GetShiftByDate(restid, startdate, enddate) {
            return $q((resolve, reject) => {

                $http.get('/api/get/getshiftByTime', { params: { restid: restid, startdate: startdate, enddate: enddate } }).then(function (res) {

                    resolve(res.data);

                }, handleError('Error getting user data'));
            });
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