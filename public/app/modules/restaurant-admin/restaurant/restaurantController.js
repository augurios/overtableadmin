(function() {
    'use strict';

    angular
        .module('restaurant')
        .controller('resataurantController', Controller);
  
    Controller.$inject = ['$scope','$state','$rootScope','$location','toaster','$http','SessionService','localStorageService','helper','$uibModal','restaurantService','PATHS','PermissionService'];
    /* @ngInject */
    function Controller($scope, $state, $rootScope,$location,toaster,$http,SessionService,localStorageService,helper,$uibModal,restaurantService,PATHS,PermissionService) {
     
        SessionService.getSession(); // get session details
        var vm = this;
        activateUserController()
        function activateUserController (){
        

        }//activateUserController
  		
    }
})();