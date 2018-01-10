(function () {
    'use strict';

    angular
        .module('rooms')
        .factory('dashboardService', dashboardService);

    dashboardService.$inject = ['$http','$q'];
    
    function dashboardService($http, $q) {
        var service = {};
        service.init        = init
        service.getInfo     = getInfo
        service.getToken    = tokenGet
        service.shownewToken    = shownewToken
        service.newToken    = newToken
        service.GetShifting = GetShifting
        service.createRoom = createRoom
        service.getRoom = getRoom
        service.editRoom = editRoom
        service.table = table
        service.updateTableNumber = updateTableNumber
        service.deleteTable = deleteTable
        service.deleteRoom = deleteRoom
        service.changeStatus = changeStatus
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
        function GetShifting() {
            return $http.get('/api/get/getshift', '').then(handleSuccess, handleError('Error getting user data'));
        }

        function createRoom(data) {
            return $http.post('/api/v1/addroom', data).then(function (res) {

                return res.data;

            }, handleError('Error getting all users'));

        }
        function table(data) {
            return $http.post('/api/v1/addtable', data).then(function (res) {

                return res.data;

            }, handleError('Error getting all users'));

        }
        function updateTableNumber(id, number, style, rotation) {
            return $http.post('/api/table/updatenumber', { id: id, number: number,style:style, rotation:rotation }).then(function (res) {
                return res.data;
            }, handleError('Error getting all users'));
        }
        function deleteTable(id) {
            return $http.post('/api/table/delete', { id: id }).then(function (res) {
                return res.data;
            }, handleError('Error getting all users'));
        }
        function editRoom(data) {
            return $http.post('/api/v1/editRoom', data).then(function (res) {

                return res.data;

            }, handleError('Error getting all users'));

        }
        function deleteRoom(id) {
            return $http.post('/api/room/delete', { id: id }).then(function (res) {
                return res.data;
            }, handleError('Error getting all users'));
        }
        function changeStatus(id, status) {
            return $http.post('/api/room/changestatus', { id: id, status: status }).then(function (res) {
                return res.data;
            }, handleError('Error getting all users'));
        }
        function getRoom(data) {
            return $q((resolve, reject) => {
                $http.get('/api/get/room').then(function (res) {
                    resolve(res.data);
                }, handleError('Error getting all users'));
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